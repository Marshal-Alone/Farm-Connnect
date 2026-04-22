import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Filter, FileText, Calendar, ExternalLink, CheckCircle, Clock, AlertCircle, Sparkles, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

interface Scheme {
  id: string;
  name: string;
  nameHindi: string;
  portal?: string;
  category: string;
  benefitType: string;
  benefitAmount: string;
  coverage?: {
    states?: string[];
    crops?: string[];
    minFarmSize?: number | null;
    maxFarmSize?: number | null;
  };
  eligibilityRules?: {
    requiresLandOwner?: boolean | 'any' | null;
    farmerCategory?: Array<'small' | 'marginal' | 'tenant' | 'any'>;
    incomeMax?: number | null;
    gender?: 'male' | 'female' | 'any';
    hasIrrigation?: boolean | 'any' | null;
  };
  documents: string[];
  deadline: string;
  status: 'active' | 'deadline-soon' | 'closed' | string;
  description: string;
  applicationSteps: string[];
  officialLinks?: Array<{ label: string; url: string }>;
  source?: string;
  lastUpdatedISO?: string;
  matchScore?: number;
  matchBreakdown?: {
    reasonsMatched?: string[];
    reasonsMissing?: string[];
  };
}

type EligibilityQuiz = {
  state: string;
  landOwner: 'yes' | 'no' | 'unknown';
  farmerCategory: 'marginal' | 'small' | 'tenant' | 'other' | 'unknown';
  annualIncome: number | null;
  hasIrrigation: 'yes' | 'no' | 'unknown';
  gender: 'male' | 'female' | 'prefer-not' | 'unknown';
};

const extractStateFromLocation = (location: string | undefined | null): string => {
  const raw = String(location || '').trim();
  if (!raw) return '';
  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 1] : raw;
};

const getQuizStorageKey = (userId: string | undefined | null) => `FarmConnect_scheme_quiz_${userId || 'guest'}`;

const safeJsonParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export default function GovernmentSchemes() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [filterBenefitType, setFilterBenefitType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCrop, setFilterCrop] = useState('all');
  const [deadlineSoon, setDeadlineSoon] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'for-you' | 'all'>('all');
  const [quizOpen, setQuizOpen] = useState(false);
  const [applyScheme, setApplyScheme] = useState<Scheme | null>(null);
  const { toast } = useToast();

  const userId = (user as unknown as { _id?: string; id?: string } | null)?._id || (user as unknown as { _id?: string; id?: string } | null)?.id || null;
  const quizStorageKey = useMemo(() => getQuizStorageKey(userId), [userId]);
  const defaultQuiz: EligibilityQuiz = useMemo(() => ({
    state: extractStateFromLocation((user as any)?.location) || 'All',
    landOwner: 'unknown',
    farmerCategory: 'unknown',
    annualIncome: null,
    hasIrrigation: 'unknown',
    gender: 'unknown'
  }), [user]);

  const [quiz, setQuiz] = useState<EligibilityQuiz>(() => {
    const saved = safeJsonParse<EligibilityQuiz | null>(localStorage.getItem(quizStorageKey), null);
    return saved ? { ...defaultQuiz, ...saved } : defaultQuiz;
  });

  const quizCompleted = useMemo(() => {
    // Mark completed if at least 3 fields are answered (not unknown)
    const answered = [
      quiz.landOwner !== 'unknown',
      quiz.farmerCategory !== 'unknown',
      quiz.hasIrrigation !== 'unknown',
      typeof quiz.annualIncome === 'number',
      quiz.gender !== 'unknown'
    ].filter(Boolean).length;
    return answered >= 3;
  }, [quiz]);

  React.useEffect(() => {
    // If storage key changes (login/logout), refresh quiz state from storage
    const saved = safeJsonParse<EligibilityQuiz | null>(localStorage.getItem(quizStorageKey), null);
    setQuiz(saved ? { ...defaultQuiz, ...saved } : defaultQuiz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStorageKey]);

  React.useEffect(() => {
    const fetchSchemes = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filterCategory !== 'all') queryParams.append('category', filterCategory);
        if (filterState !== 'all') queryParams.append('state', filterState);
        if (filterBenefitType !== 'all') queryParams.append('benefitType', filterBenefitType);
        if (filterStatus !== 'all') queryParams.append('status', filterStatus);
        if (filterCrop !== 'all') queryParams.append('crop', filterCrop);
        if (deadlineSoon) queryParams.append('deadlineSoon', 'true');
        if (searchTerm) queryParams.append('search', searchTerm);

        // Personalization context for "For You"
        if (activeTab === 'for-you' && user) {
          const derivedState = extractStateFromLocation((user as any)?.location);
          queryParams.append('userState', quiz.state && quiz.state !== 'All' ? quiz.state : derivedState);
          queryParams.append('userCrops', Array.isArray((user as any)?.crops) ? (user as any).crops.join(',') : '');
          queryParams.append('farmSize', String((user as any)?.farmSize ?? ''));

          // quiz.*
          if (quiz.landOwner !== 'unknown') queryParams.append('quiz_landOwner', String(quiz.landOwner === 'yes'));
          if (quiz.farmerCategory !== 'unknown') queryParams.append('quiz_farmerCategory', quiz.farmerCategory);
          if (typeof quiz.annualIncome === 'number') queryParams.append('quiz_annualIncome', String(quiz.annualIncome));
          if (quiz.hasIrrigation !== 'unknown') queryParams.append('quiz_hasIrrigation', String(quiz.hasIrrigation === 'yes'));
          if (quiz.gender !== 'unknown' && quiz.gender !== 'prefer-not') queryParams.append('quiz_gender', quiz.gender);
        }

        const response = await fetch(`/api/schemes?${queryParams.toString()}`);
        const result = await response.json();

        if (result.success) {
          setSchemes(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch schemes:', error);
        toast({
          title: "Error",
          description: "Failed to load government schemes. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSchemes();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [filterCategory, filterState, filterBenefitType, filterStatus, filterCrop, deadlineSoon, searchTerm, toast, activeTab, user, quiz]);

  React.useEffect(() => {
    // Default tab: For You when logged in, else All
    setActiveTab(user ? 'for-you' : 'all');
  }, [userId]);

  const saveQuiz = () => {
    localStorage.setItem(quizStorageKey, JSON.stringify(quiz));
    toast({
      title: "Saved",
      description: "Eligibility quiz saved. Recommendations updated."
    });
    setQuizOpen(false);
  };

  const resetQuiz = () => {
    localStorage.removeItem(quizStorageKey);
    setQuiz(defaultQuiz);
    toast({ title: "Reset", description: "Eligibility quiz reset." });
  };

  const getSchemeLinks = (scheme: Scheme | null) => {
    if (!scheme) return [];
    const official = Array.isArray(scheme.officialLinks) ? scheme.officialLinks.filter((l) => l?.url) : [];
    if (official.length > 0) return official;
    if (scheme.portal) return [{ label: 'Official portal', url: scheme.portal }];
    const key = `${scheme.id || ''} ${scheme.name || ''}`.toLowerCase();
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
    if (matched) return [{ label: matched.label, url: matched.url }];
    return [];
  };

  const handleApplyScheme = (scheme: Scheme) => {
    if (scheme.status === 'closed') {
      toast({
        title: "Application Closed",
        description: "This scheme's application period has ended.",
        variant: "destructive"
      });
      return;
    }

    // Show a guided “what to do next” dialog instead of only a toast
    setApplyScheme(scheme);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'deadline-soon':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'closed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'deadline-soon':
        return 'Deadline Soon';
      case 'closed':
        return 'Closed';
      default:
        return 'Active';
    }
  };

  return (
    <>
      <SEO
        title="Government Schemes for Farmers - PM-KISAN, PMFBY & More | FarmConnect"
        description="Discover and apply for agricultural schemes and subsidies. Get details on PM-KISAN, Fasal Bima, Kisan Credit Card and more government programs for Indian farmers."
        url="https://farmbro.vercel.app/schemes"
      />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
        <div className="container mx-auto py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="mobile-title mb-3 text-foreground">
              🏛️ Government Schemes Portal
            </h1>
            <p className="mobile-subtitle mx-auto max-w-2xl">
              Discover schemes, check eligibility, and apply with official sources.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1">
                <Info className="h-3.5 w-3.5" />
                Eligibility may vary by official criteria. Always verify on the portal.
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1">
                <Sparkles className="h-3.5 w-3.5" />
                Explainable recommendations (no black-box).
              </span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'for-you' | 'all')} className="mb-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="for-you" disabled={!user}>For You</TabsTrigger>
                <TabsTrigger value="all">All Schemes</TabsTrigger>
              </TabsList>

              <div className="flex flex-wrap items-center gap-2">
                {user && (
                  <>
                    <Badge variant={quizCompleted ? 'default' : 'secondary'} className="text-xs">
                      {quizCompleted ? 'Quiz completed' : 'Quiz recommended'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setQuizOpen(true)}>
                      {quizCompleted ? 'Edit eligibility quiz' : 'Take eligibility quiz'}
                    </Button>
                  </>
                )}
              </div>
            </div>

            <TabsContent value="for-you" className="mt-4">
              {!user ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Login to see personalized schemes</CardTitle>
                    <CardDescription>
                      We use your profile (state, crops, farm size) and your one-time quiz answers to rank schemes with clear reasons.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    State: {quiz.state || extractStateFromLocation((user as any)?.location) || '—'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Crops: {Array.isArray((user as any)?.crops) && (user as any).crops.length ? (user as any).crops.slice(0, 2).join(', ') : '—'}
                    {Array.isArray((user as any)?.crops) && (user as any).crops.length > 2 ? ` +${(user as any).crops.length - 2}` : ''}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Farm size: {(user as any)?.farmSize ?? 0} acres
                  </Badge>
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="mt-4">
              {/* Search and Filters */}
              <div className="mobile-section mb-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search schemes, Hindi name, benefit, ministry..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="income">Income Support</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="irrigation">Irrigation</SelectItem>
                      <SelectItem value="market">Market</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterState} onValueChange={setFilterState}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="Kerala">Kerala</SelectItem>
                      <SelectItem value="Punjab">Punjab</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterBenefitType} onValueChange={setFilterBenefitType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Benefit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Benefit Types</SelectItem>
                      <SelectItem value="direct-cash">Direct Cash</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="subsidy">Subsidy</SelectItem>
                      <SelectItem value="grant">Grant</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="market-access">Market Access</SelectItem>
                      <SelectItem value="credit-guarantee">Credit Guarantee</SelectItem>
                      <SelectItem value="assistance">Assistance</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="deadline-soon">Deadline Soon</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterCrop} onValueChange={setFilterCrop}>
                    <SelectTrigger>
                      <SelectValue placeholder="Crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Crops</SelectItem>
                      <SelectItem value="Horticulture">Horticulture</SelectItem>
                      <SelectItem value="Wheat">Wheat</SelectItem>
                      <SelectItem value="Rice">Rice</SelectItem>
                      <SelectItem value="Cotton">Cotton</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant={deadlineSoon ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDeadlineSoon((v) => !v)}
                  >
                    {deadlineSoon ? 'Deadline soon: ON' : 'Deadline soon'}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Schemes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {schemes.map((scheme) => (
              <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-4 sm:p-6 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">{scheme.name}</CardTitle>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{scheme.nameHindi}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {typeof scheme.matchScore === 'number' && activeTab === 'for-you' && (
                        <Badge variant="outline" className="text-xs">
                          {scheme.matchScore}% match
                        </Badge>
                      )}
                      {getStatusIcon(scheme.status)}
                      <Badge
                        variant={scheme.status === 'active' ? 'default' : scheme.status === 'deadline-soon' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {getStatusText(scheme.status)}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">{scheme.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                        ₹
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-medium">Benefit</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{scheme.benefitAmount}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-xs sm:text-sm font-medium">Deadline</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{scheme.deadline}</p>
                      </div>
                    </div>
                  </div>

                  {activeTab === 'for-you' && (
                    <div className="rounded-xl border bg-muted/30 p-3">
                      <p className="text-xs font-medium mb-2">Why recommended</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {(scheme.matchBreakdown?.reasonsMatched || []).slice(0, 2).map((r, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>{r}</span>
                          </li>
                        ))}
                        {(scheme.matchBreakdown?.reasonsMissing || []).slice(0, 1).map((r, idx) => (
                          <li key={`m-${idx}`} className="flex items-start gap-2">
                            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                            <span>{r}</span>
                          </li>
                        ))}
                        {!(scheme.matchBreakdown?.reasonsMatched || []).length && !(scheme.matchBreakdown?.reasonsMissing || []).length && (
                          <li className="flex items-start gap-2">
                            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-slate-400" />
                            <span>Complete your eligibility quiz to see personalized recommendation reasons.</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {scheme.category && <Badge variant="outline" className="text-xs">{scheme.category}</Badge>}
                    {scheme.benefitType && <Badge variant="secondary" className="text-xs">{scheme.benefitType}</Badge>}
                    {scheme.source && <Badge variant="outline" className="text-xs">Source: {scheme.source}</Badge>}
                  </div>

                  <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                    <Button onClick={() => handleApplyScheme(scheme)} className="flex-1" disabled={scheme.status === 'closed'}>
                      {scheme.status === 'closed' ? 'Application Closed' : 'Apply (Official)'}
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedScheme(scheme)}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {schemes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No schemes found matching your criteria.
              </p>
            </div>
          )}

          {/* Scheme Details Dialog */}
          <Dialog open={Boolean(selectedScheme)} onOpenChange={(open) => !open && setSelectedScheme(null)}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              {selectedScheme && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedScheme.name}</DialogTitle>
                    <DialogDescription>{selectedScheme.nameHindi}</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">{selectedScheme.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm">Benefit</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                          {selectedScheme.benefitAmount}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm">Deadline</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                          {selectedScheme.deadline}
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-sm">Last updated</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                          {selectedScheme.lastUpdatedISO || '—'}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="rounded-xl border bg-muted/30 p-4">
                      <p className="text-sm font-medium mb-1">Official source</p>
                      <p className="text-sm text-muted-foreground">{selectedScheme.source || '—'}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(selectedScheme.officialLinks || []).map((l) => (
                          <a
                            key={l.url}
                            href={l.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs hover:bg-muted"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            {l.label}
                          </a>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Eligibility checklist</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <li className="rounded-lg border p-3">
                          <p className="text-xs text-muted-foreground">Land ownership</p>
                          <p className="font-medium">
                            {quiz.landOwner === 'unknown' ? 'Not provided' : quiz.landOwner === 'yes' ? 'Yes' : 'No'}
                          </p>
                        </li>
                        <li className="rounded-lg border p-3">
                          <p className="text-xs text-muted-foreground">Farmer category</p>
                          <p className="font-medium">{quiz.farmerCategory === 'unknown' ? 'Not provided' : quiz.farmerCategory}</p>
                        </li>
                        <li className="rounded-lg border p-3">
                          <p className="text-xs text-muted-foreground">Income</p>
                          <p className="font-medium">{typeof quiz.annualIncome === 'number' ? `₹${quiz.annualIncome.toLocaleString()}` : 'Not provided'}</p>
                        </li>
                        <li className="rounded-lg border p-3">
                          <p className="text-xs text-muted-foreground">Irrigation</p>
                          <p className="font-medium">
                            {quiz.hasIrrigation === 'unknown' ? 'Not provided' : quiz.hasIrrigation === 'yes' ? 'Yes' : 'No'}
                          </p>
                        </li>
                      </ul>
                      <p className="mt-2 text-xs text-muted-foreground">
                        This checklist is based on your profile + quiz. Always verify final eligibility on the official portal.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Required documents</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {selectedScheme.documents.map((doc) => (
                          <li key={doc}>{doc}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Application steps</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        {selectedScheme.applicationSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setQuizOpen(true)} disabled={!user}>
                      Edit eligibility quiz
                    </Button>
                    <Button onClick={() => handleApplyScheme(selectedScheme)} disabled={selectedScheme.status === 'closed'}>
                      {selectedScheme.status === 'closed' ? 'Application Closed' : 'Open official portal'}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Eligibility Quiz Dialog */}
          <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Eligibility Quiz (one-time)</DialogTitle>
                <DialogDescription>
                  These answers are stored on this device and used only to rank schemes with clear reasons.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Your state</p>
                  <Input value={quiz.state} onChange={(e) => setQuiz((q) => ({ ...q, state: e.target.value }))} placeholder="e.g., Maharashtra" />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Land owner?</p>
                  <Select value={quiz.landOwner} onValueChange={(v) => setQuiz((q) => ({ ...q, landOwner: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">Not sure</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Farmer category</p>
                  <Select value={quiz.farmerCategory} onValueChange={(v) => setQuiz((q) => ({ ...q, farmerCategory: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">Not sure</SelectItem>
                      <SelectItem value="marginal">Marginal</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="tenant">Tenant</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Annual income (₹)</p>
                  <Input
                    type="number"
                    value={typeof quiz.annualIncome === 'number' ? quiz.annualIncome : ''}
                    onChange={(e) => setQuiz((q) => ({ ...q, annualIncome: e.target.value ? Number(e.target.value) : null }))}
                    placeholder="e.g., 150000"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Optional. Helps for income-limited schemes.</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Irrigation available?</p>
                  <Select value={quiz.hasIrrigation} onValueChange={(v) => setQuiz((q) => ({ ...q, hasIrrigation: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">Not sure</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Gender (optional)</p>
                  <Select value={quiz.gender} onValueChange={(v) => setQuiz((q) => ({ ...q, gender: v as any }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">Not sure</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={resetQuiz}>Reset</Button>
                <Button onClick={saveQuiz}>Save quiz</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Apply / Next steps dialog */}
          <Dialog open={Boolean(applyScheme)} onOpenChange={(open) => !open && setApplyScheme(null)}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
              {applyScheme && (
                <>
                  {(() => {
                    const applyLinks = getSchemeLinks(applyScheme);
                    return (
                      <>
                  <DialogHeader>
                    <DialogTitle>Next steps: {applyScheme.name}</DialogTitle>
                    <DialogDescription>
                      Follow these steps and use the official portal links below. (Always verify latest criteria on the portal.)
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="rounded-xl border bg-muted/30 p-4">
                      <p className="text-sm font-medium mb-2">Official links</p>
                      <div className="flex flex-wrap gap-2">
                        {applyLinks.length ? (
                          applyLinks.map((l) => (
                            <a
                              key={l.url}
                              href={l.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs hover:bg-muted"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              {l.label}
                            </a>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No official link available for this scheme yet.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">What to do next</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        {(applyScheme.applicationSteps || []).map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Documents to keep ready</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {(applyScheme.documents || []).map((doc) => (
                          <li key={doc}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => setApplyScheme(null)}>
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        const url = applyLinks[0]?.url;
                        if (url) window.open(url, '_blank', 'noopener,noreferrer');
                        else toast({ title: 'No official link', description: 'This scheme does not have an official portal link yet.' });
                      }}
                      disabled={!applyLinks[0]?.url}
                    >
                      Open official portal
                    </Button>
                  </DialogFooter>
                      </>
                    );
                  })()}
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}
