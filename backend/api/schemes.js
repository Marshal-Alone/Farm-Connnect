import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadSchemesFromJson() {
    const dataPath = path.join(__dirname, '..', 'data', 'schemes.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(raw);
}

function normalizeString(value) {
    return String(value || '').trim().toLowerCase();
}

function includesAllToken(list) {
    return Array.isArray(list) && list.some((v) => normalizeString(v) === 'all');
}

function toOfficialLinks(scheme) {
    const rawLinks = Array.isArray(scheme?.officialLinks) ? scheme.officialLinks : [];
    const cleaned = rawLinks
        .filter((l) => l && typeof l.url === 'string' && l.url.trim())
        .map((l) => ({
            label: l.label || 'Official portal',
            url: l.url.trim()
        }));

    if (cleaned.length > 0) return cleaned;

    const portal = typeof scheme?.portal === 'string' ? scheme.portal.trim() : '';
    if (portal) {
        return [{ label: 'Official portal', url: portal }];
    }

    const key = normalizeString(`${scheme?.id || ''} ${scheme?.abbr || ''} ${scheme?.name || ''}`);
    const fallbackByScheme = [
        { test: ['pm-kisan'], label: 'PM-KISAN Portal', url: 'https://pmkisan.gov.in' },
        { test: ['pmfby', 'fasal bima'], label: 'PMFBY Portal', url: 'https://pmfby.gov.in' },
        { test: ['kcc', 'kisan credit'], label: 'NABARD KCC Info', url: 'https://www.nabard.org/content1.aspx?id=590' },
        { test: ['pmksy', 'sinchayee'], label: 'PMKSY Portal', url: 'https://pmksy.gov.in' },
        { test: ['soil health', 'shc'], label: 'Soil Health Portal', url: 'https://soilhealth.dac.gov.in' },
        { test: ['enam', 'national agriculture market'], label: 'eNAM Portal', url: 'https://enam.gov.in' },
        { test: ['pm-kmy', 'maandhan'], label: 'Maandhan Portal', url: 'https://maandhan.in' },
        { test: ['aif', 'agriculture infrastructure fund'], label: 'AIF Portal', url: 'https://agriinfra.dac.gov.in' },
        { test: ['pm-kusum', 'kusum'], label: 'PM-KUSUM Portal', url: 'https://pmkusum.mnre.gov.in' },
        { test: ['pkvy', 'paramparagat'], label: 'PGS India Portal', url: 'https://pgsindia-ncof.gov.in' },
        { test: ['smam', 'mechanisation'], label: 'Agri Machinery Portal', url: 'https://agrimachinery.nic.in' },
        { test: ['iss', 'interest subvention'], label: 'NABARD', url: 'https://www.nabard.org' },
        { test: ['rkvy', 'raftaar'], label: 'RKVY Portal', url: 'https://rkvy.nic.in' },
        { test: ['nlm', 'livestock'], label: 'NLM (DAHD)', url: 'https://dahd.nic.in/schemes-programmes/schemes/national-livestock-mission' },
        { test: ['aep', 'export policy'], label: 'APEDA Portal', url: 'https://apeda.gov.in' }
    ];
    const matched = fallbackByScheme.find((item) => item.test.some((t) => key.includes(t)));
    return matched ? [{ label: matched.label, url: matched.url }] : [];
}

function schemeMatchesFilters(scheme, filters) {
    const { category, state, search, crop, benefitType, status, deadlineSoon } = filters;

    if (category && category !== 'all' && scheme.category !== category) return false;

    if (benefitType && benefitType !== 'all' && scheme.benefitType !== benefitType) return false;

    if (status && status !== 'all' && scheme.status !== status) return false;

    if (state && state !== 'all') {
        const states = scheme?.coverage?.states || [];
        if (!includesAllToken(states)) {
            const normalizedState = normalizeString(state);
            const hasState = states.some((s) => normalizeString(s) === normalizedState);
            if (!hasState) return false;
        }
    }

    if (crop && crop !== 'all') {
        const crops = scheme?.coverage?.crops || [];
        if (!includesAllToken(crops)) {
            const normalizedCrop = normalizeString(crop);
            const hasCrop = crops.some((c) => normalizeString(c) === normalizedCrop);
            if (!hasCrop) return false;
        }
    }

    if (deadlineSoon === 'true') {
        const deadline = scheme.deadline ? new Date(scheme.deadline) : null;
        if (!deadline || Number.isNaN(deadline.getTime())) return false;
        const days = (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        if (days < 0 || days > 30) return false;
    }

    if (search) {
        const q = normalizeString(search);
        const hay = [
            scheme.name,
            scheme.nameHindi,
            scheme.description,
            scheme.source,
            scheme.category,
            scheme.benefitType,
            scheme.benefitAmount
        ]
            .map(normalizeString)
            .join(' | ');
        if (!hay.includes(q)) return false;
    }

    return true;
}

function scoreSchemeForUser(scheme, userCtx) {
    const reasonsMatched = [];
    const reasonsMissing = [];

    let score = 0;
    const maxScore = 100;

    // Weights (transparent + deterministic)
    const W_STATE = 30;
    const W_CROP = 25;
    const W_FARMSIZE = 15;
    const W_QUIZ = 30;

    // State match
    if (userCtx.userState) {
        const states = scheme?.coverage?.states || [];
        if (includesAllToken(states)) {
            score += W_STATE;
            reasonsMatched.push('Available in all states');
        } else if (states.some((s) => normalizeString(s) === normalizeString(userCtx.userState))) {
            score += W_STATE;
            reasonsMatched.push(`Available in ${userCtx.userState}`);
        } else {
            reasonsMissing.push(`Not available in ${userCtx.userState}`);
        }
    } else {
        // unknown state: neutral
        score += Math.round(W_STATE * 0.4);
        reasonsMatched.push('State not provided (neutral scoring)');
    }

    // Crop match
    if (Array.isArray(userCtx.userCrops) && userCtx.userCrops.length > 0) {
        const crops = scheme?.coverage?.crops || [];
        if (includesAllToken(crops)) {
            score += W_CROP;
            reasonsMatched.push('Applies to all crops');
        } else {
            const normalizedCrops = new Set(userCtx.userCrops.map(normalizeString));
            const matched = crops.some((c) => normalizedCrops.has(normalizeString(c)));
            if (matched) {
                score += W_CROP;
                reasonsMatched.push('Matches your crop(s)');
            } else {
                reasonsMissing.push('Does not match your selected crops');
            }
        }
    } else {
        score += Math.round(W_CROP * 0.4);
        reasonsMatched.push('Crops not provided (neutral scoring)');
    }

    // Farm size match
    if (Number.isFinite(userCtx.farmSize)) {
        const min = scheme?.coverage?.minFarmSize ?? null;
        const max = scheme?.coverage?.maxFarmSize ?? null;
        const size = Number(userCtx.farmSize);
        const minOk = min == null || size >= Number(min);
        const maxOk = max == null || size <= Number(max);
        if (minOk && maxOk) {
            score += W_FARMSIZE;
            reasonsMatched.push('Farm size fits scheme criteria');
        } else {
            reasonsMissing.push('Farm size may not fit scheme criteria');
        }
    } else {
        score += Math.round(W_FARMSIZE * 0.4);
        reasonsMatched.push('Farm size not provided (neutral scoring)');
    }

    // Quiz eligibility (machine readable)
    const rules = scheme?.eligibilityRules || {};
    const quiz = userCtx.quiz || {};
    let quizScore = 0;
    let quizChecks = 0;
    let quizPass = 0;

    const ruleChecks = [
        {
            key: 'requiresLandOwner',
            check: () => {
                if (rules.requiresLandOwner === 'any' || rules.requiresLandOwner == null) return { neutral: true };
                if (quiz.landOwner == null) return { neutral: true, missing: 'Land ownership not provided' };
                return quiz.landOwner === Boolean(rules.requiresLandOwner)
                    ? { pass: true, match: 'Land ownership matches requirement' }
                    : { pass: false, miss: 'Land ownership requirement not met' };
            }
        },
        {
            key: 'farmerCategory',
            check: () => {
                if (!Array.isArray(rules.farmerCategory) || rules.farmerCategory.length === 0) return { neutral: true };
                if (rules.farmerCategory.includes('any')) return { neutral: true };
                if (!quiz.farmerCategory) return { neutral: true, missing: 'Farmer category not provided' };
                const ok = rules.farmerCategory.some((c) => normalizeString(c) === normalizeString(quiz.farmerCategory));
                return ok ? { pass: true, match: 'Farmer category matches requirement' } : { pass: false, miss: 'Farmer category may be ineligible' };
            }
        },
        {
            key: 'incomeMax',
            check: () => {
                if (!Number.isFinite(Number(rules.incomeMax))) return { neutral: true };
                if (!Number.isFinite(Number(quiz.annualIncome))) return { neutral: true, missing: 'Income not provided' };
                const ok = Number(quiz.annualIncome) <= Number(rules.incomeMax);
                return ok ? { pass: true, match: 'Income fits requirement' } : { pass: false, miss: 'Income exceeds limit' };
            }
        },
        {
            key: 'hasIrrigation',
            check: () => {
                if (rules.hasIrrigation === 'any' || rules.hasIrrigation == null) return { neutral: true };
                if (quiz.hasIrrigation == null) return { neutral: true, missing: 'Irrigation info not provided' };
                const ok = Boolean(quiz.hasIrrigation) === Boolean(rules.hasIrrigation);
                return ok ? { pass: true, match: 'Irrigation status matches requirement' } : { pass: false, miss: 'Irrigation requirement may not be met' };
            }
        },
        {
            key: 'gender',
            check: () => {
                if (!rules.gender || rules.gender === 'any') return { neutral: true };
                if (!quiz.gender) return { neutral: true, missing: 'Gender not provided' };
                const ok = normalizeString(quiz.gender) === normalizeString(rules.gender);
                return ok ? { pass: true, match: 'Gender matches requirement' } : { pass: false, miss: 'Gender requirement may not be met' };
            }
        }
    ];

    for (const rc of ruleChecks) {
        const r = rc.check();
        if (r.neutral) continue;
        quizChecks += 1;
        if (r.pass) {
            quizPass += 1;
            if (r.match) reasonsMatched.push(r.match);
        } else {
            if (r.miss) reasonsMissing.push(r.miss);
        }
        if (r.missing) reasonsMissing.push(r.missing);
    }

    if (quizChecks === 0) {
        quizScore = Math.round(W_QUIZ * 0.4);
        reasonsMatched.push('Eligibility quiz not used (neutral scoring)');
    } else {
        quizScore = Math.round((quizPass / quizChecks) * W_QUIZ);
    }

    score += quizScore;

    const matchScore = Math.max(0, Math.min(maxScore, score));

    return {
        matchScore,
        reasonsMatched: reasonsMatched.slice(0, 6),
        reasonsMissing: reasonsMissing.slice(0, 6)
    };
}

// GET /api/schemes - List all schemes with optional filters
router.get('/', async (req, res) => {
    console.log('📋 [GET /api/schemes] Request received', { query: req.query, timestamp: new Date().toISOString() });
    try {
        const {
            category,
            state,
            search,
            crop,
            benefitType,
            status,
            deadlineSoon,
            userState,
            userCrops,
            farmSize,
            quiz_landOwner,
            quiz_farmerCategory,
            quiz_annualIncome,
            quiz_hasIrrigation,
            quiz_gender
        } = req.query;

        const filters = { category, state, search, crop, benefitType, status, deadlineSoon };

        const schemes = loadSchemesFromJson();
        const filtered = schemes.filter((s) => schemeMatchesFilters(s, filters));

        const userCtx = {
            userState: userState ? String(userState) : null,
            userCrops: typeof userCrops === 'string' && userCrops.trim()
                ? userCrops.split(',').map((c) => c.trim()).filter(Boolean)
                : [],
            farmSize: farmSize != null && String(farmSize).trim() !== '' ? Number(farmSize) : null,
            quiz: {
                landOwner: quiz_landOwner == null ? null : String(quiz_landOwner) === 'true',
                farmerCategory: quiz_farmerCategory ? String(quiz_farmerCategory) : null,
                annualIncome: quiz_annualIncome != null && String(quiz_annualIncome).trim() !== '' ? Number(quiz_annualIncome) : null,
                hasIrrigation: quiz_hasIrrigation == null ? null : String(quiz_hasIrrigation) === 'true',
                gender: quiz_gender ? String(quiz_gender) : null
            }
        };

        const withScores = filtered.map((scheme) => {
            const normalizedScheme = {
                ...scheme,
                officialLinks: toOfficialLinks(scheme)
            };
            const match = scoreSchemeForUser(scheme, userCtx);
            return {
                ...normalizedScheme,
                matchScore: match.matchScore,
                matchBreakdown: {
                    reasonsMatched: match.reasonsMatched,
                    reasonsMissing: match.reasonsMissing
                }
            };
        });

        // Sort: when personalization present, rank by score; else stable by lastUpdated
        const personalizationOn = Boolean(userState || userCrops || farmSize || quiz_landOwner || quiz_farmerCategory || quiz_annualIncome || quiz_hasIrrigation || quiz_gender);
        const sorted = withScores.sort((a, b) => {
            if (personalizationOn) return (b.matchScore || 0) - (a.matchScore || 0);
            return normalizeString(b.lastUpdatedISO).localeCompare(normalizeString(a.lastUpdatedISO));
        });

        console.log(`✅ [GET /api/schemes] Success, found ${sorted.length} schemes`);
        return res.json({ success: true, data: sorted });
    } catch (error) {
        console.error('Error fetching schemes:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch schemes' });
    }
});

// GET /api/schemes/:id - Get scheme details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const schemes = loadSchemesFromJson();
        const scheme = schemes.find((s) => String(s.id) === String(id));

        if (!scheme) {
            return res.status(404).json({ success: false, error: 'Scheme not found' });
        }

        res.json({
            success: true,
            data: scheme
        });
    } catch (error) {
        console.error('Error fetching scheme details:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch scheme details' });
    }
});

export default router;
