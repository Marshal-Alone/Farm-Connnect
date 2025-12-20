










Project Synopsis
On
FARM CONNECT: PATHWAY TO PROGRESS

Submitted to Rashtrasant Tukadoji Maharaj Nagpur University, Nagpur in partial
fulfillment of requirement for the award of the degree of

BACHELOR OF TECHNOLOGY
In
Computer Science & Engineering


Submitted By
Marshal Alone                    Vaishnavi Getme
Aditya Kawale                    Sanskruti Patil
Mrunali Umak


Under the Guidance of
Prof. Tejas Dhule
Assistant Professor



Department of Computer Science & Engineering
NAGPUR INSTITUTE OF TECHNOLOGY
Mahurzari, Katol Road Nagpur-441501
Rashtrasant Tukadoji Maharaj Nagpur University, Nagpur
2025-2026











---

## CONTENTS

| Title | Page No. |
|-------|----------|
| Declaration | i |
| Vision, Mission, PSO & PEO | ii |
| Program Outcomes | iii |
| Course Outcomes | iv |
| Abstract | v |
| 1. INTRODUCTION | 1 |
| 2. LITERATURE SURVEY | 2 |
| 3. PROJECT OBJECTIVES | 8 |
| 4. PROBLEM FORMULATION | 9 |
| 4.1 Existing System | 9 |
| 4.2 Proposed System | 10 |
| 5. RESEARCH METHODOLOGY & PROPOSED SOLUTION | 11 |
| 6. HARDWARE AND SOFTWARE REQUIREMENTS | 16 |
| 7. PLAN OF WORK | 17 |
| 8. REFERENCES | 18 |










---

## NAGPUR INSTITUTE OF TECHNOLOGY
(Affiliated to RTM Nagpur University & Approved by AICTE New Delhi)
Campus: 13/2, Mahurzari, Near Fetri, Katol Road, Nagpur-441501, India
Email Id: registrar@nit.edu.in | Web: www.nit.edu.in | Contact No. 9764974144

NAAC "A" Accredited | AICTE ID: 1-4830701 | DTE Code: 04144 | RTMNU Code: 315 | AISHE Code: C-18725

### Department of Computer Science & Engineering

---

## DECLARATION

We hereby declare that the Project Report entitled **"Farm Connect: Pathway To Progress"** submitted herein has been carried out by us in the Department of Computer Science & Engineering at Nagpur Institute of Technology, Nagpur. The presented work is original and has not been submitted earlier as a whole or in part for the award of any degree/diploma at this or any other Institution/University.

We also hereby assign to the Department of Computer Science & Engineering of Nagpur Institute of Technology, Nagpur all rights under copyright that may exist in and to the above work and any revised or expanded derivative works based on the work as mentioned. Other work copied from references, manuals, etc. are disclaimed.

| Sr. No. | Name of the Students | Signature |
|---------|---------------------|-----------|
| 1 | Marshal Alone | |
| 2 | Aditya Kawale | |
| 3 | Vaishnavi Getme | |
| 4 | Sanskruti Patil | |
| 5 | Mrunali Umak | |

Date: ____/____/____

**Page i**










---

## NAGPUR INSTITUTE OF TECHNOLOGY
(Affiliated to RTM Nagpur University & Approved by AICTE New Delhi)
Campus: 13/2, Mahurzari, Near Fetri, Katol Road, Nagpur-441501, India

### Department of Computer Science & Engineering

---

## Vision of the Institute
Service to the Society by creating Technical & Skilled Manpower through value-based Technical Education.

## Mission of the Institute
- To provide quality technical education to meet the requirements of industries and society.
- To equip students with need-based technical skills through continual improvement in Teaching-Learning Processes and research activity.
- To inculcate ethical values for overall holistic development of students.

## Vision of the Department
To foster Computer Science and Engineering graduates by imparting quality technical education through need-based technical skills with ethical values.

## Mission of the Department
- To provide quality initiatives in skill-based teaching-learning processes to improve technical knowledge in Computer Science and Engineering.
- To enhance intellectual capital of stakeholders by providing research and innovation avenues and improved industry interactions.
- To increase societal connect for need-based problems through extra-curricular activities.

## Program Specific Outcomes (PSO)
- **PSO-1:** To demonstrate knowledge and understanding of CS engineering concepts and apply these to industries.
- **PSO-2:** The ability to understand, analyze, and develop computer programs in the areas related to algorithms, system software, multimedia, web design, big data analytics, and networking for efficient design of computer-based systems of varying complexity.
- **PSO-3:** The ability to employ modern computer languages, environments, and platforms in creating innovative career paths to be an entrepreneur, and a zest for higher studies.

## Program Educational Objectives (PEO)
- **PEO1:** Graduates will pursue successful careers as software professionals, IT consultants, and system administrators.
- **PEO2:** Graduates will adapt to the changing technologies, tools, and societal requirements.
- **PEO3:** To create and sustain a community of learning in which students acquire knowledge and apply in their concerned fields with due consideration for ethical, ecological, and economic issues.

**Page ii**










---

## NAGPUR INSTITUTE OF TECHNOLOGY
(Affiliated to RTM Nagpur University & Approved by AICTE New Delhi)

### Department of Computer Science & Engineering

---

## Program Outcomes (UG)

- **PO1. Engineering knowledge:** Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.

- **PO2. Problem analysis:** Identify, formulate, and analyze real-world problems to reach substantial conclusions using computer science and engineering concepts.

- **PO3. Design/development of solutions:** Design a system component and process to meet desired needs.

- **PO4. Conduct problem investigations:** Use research-based knowledge and methods including design, interpretation of data, analysis & synthesis of the information to provide valid conclusions.

- **PO5. Modern tool usage:** Apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.

- **PO6. The engineer, industry and society:** Communicate effectively both in written & oral formats.

- **PO7. Environment and sustainability:** Understand the impact of professional engineering solutions in societal and environmental contexts.

- **PO8. Ethics:** Demonstrate professional skills and ethics.

- **PO9. Individual and team work:** Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.

- **PO10. Communication:** Ability to communicate effectively with peer community and society on complex software/system engineering activities through unambiguous spoken language, written reports, and presentations.

- **PO11. Project management and finance:** Ability to apply the knowledge of Engineering and Management principles to manage projects as a team member or leader in multidisciplinary teams.

- **PO12. Life-long learning:** Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.

**Page iii**










---

## NAGPUR INSTITUTE OF TECHNOLOGY
(Affiliated to RTM Nagpur University & Approved by AICTE New Delhi)

### Department of Computer Science & Engineering

**YEAR/SEM:** IV/VIII
**COURSE NAME:** PROJECT
**COURSE CODE:** BTECHCSE705T

---

## Course Outcomes (CO)

After studying the course, the students will be able to:

| CO | Outcome Description |
|----|---------------------|
| **CO1** | To display the working knowledge and skills to the industry. |
| **CO2** | Deeper knowledge of methods in major fields of study. |
| **CO3** | To gain a consciousness of ethical aspects of research and development work. |
| **CO4** | Capability to plan and use adequate methods to conduct qualified tasks in given frameworks and evaluate the work. |

**Page iv**










---

## ABSTRACT

**Farm Connect: Pathway to Progress** is a comprehensive, multi-functional agricultural support system developed to empower farmers through the integration of technology into rural development. The project addresses critical challenges faced by farming communities, particularly the lack of timely information, limited market access, and difficulties in availing government schemes, loans, and machinery. By offering real-time data and early warning alerts, Farm Connect seeks to bridge the information and accessibility gap that often hinders agricultural productivity and farmer welfare.

The system has been designed with a strong user-centric approach, incorporating multilingual support and voice input features to ensure inclusivity for farmers with limited literacy or technological skills. Its modular architecture allows each component—such as disease detection, market access, government scheme integration, and weather alert systems—to be developed, tested, and validated individually before being integrated into the full platform.

### Key Features of Farm Connect:
- **AI-Powered Disease Detection:** Image analysis using configurable AI providers (Groq LLM by default; optionally Google Gemini Vision AI) to analyze crop images and provide disease identification, severity assessment, and treatment recommendations
- **Smart Weather Dashboard:** Real-time weather forecasting with agricultural insights and farming alerts
- **Machinery Marketplace:** Platform for farmers to rent and share agricultural equipment
- **Government Schemes Portal:** Consolidated information on subsidies, loans, and support programs
- **Voice-Enabled Interface:** Multilingual voice assistant for farmers with limited literacy
- **AI-Powered Chatbot (Voice & Text):** Interactive farming assistant where farmers can ask queries via voice input OR text chat in 5 regional languages (Hindi, Marathi, Malayalam, Punjabi, English). Features include speech recognition and text-to-speech output for accessibility; AI responses use Groq LLM by default (Gemini is also supported).
- **User Profile:** Personal dashboard for managing bookings and preferences

The platform is built using modern web technologies (React.js, Node.js, MongoDB) ensuring scalability, responsiveness, and cross-platform accessibility. Data collection was carried out through farmer feedback, mock deployments, and agricultural databases, ensuring that the system remained practical, relevant, and adaptable to diverse farming contexts.

The findings from pilot testing highlight significant improvements in farmers' decision-making processes, enhanced market reach, and better access to essential resources. The platform demonstrated ease of use, adaptability, and scalability across varied agricultural communities, making it suitable for widespread adoption.

In conclusion, Farm Connect emerges as a transformative solution capable of reshaping agricultural practices, strengthening rural livelihoods, and driving progress in the agricultural sector. Its emphasis on accessibility, innovation, and farmer empowerment positions it as a scalable model for inclusive rural development.

**Keywords:** Agriculture, AI Disease Detection, Real-time Weather, Machinery Rental, Government Schemes, Voice Interface, Rural Development, Technology Integration

**Page v**










---

## 1. INTRODUCTION

### 1.1 Background

Agriculture continues to be a foundational pillar of emerging economies such as India, where a substantial proportion of the population—approximately 58%—depends on farming as its primary source of livelihood. Despite the sector's importance, farmers—especially small and marginal cultivators—face persistent challenges in accessing timely and reliable information related to crop management, weather changes, market prices, and government support services. Traditional information-dissemination channels remain slow, fragmented, and often inaccessible due to language barriers and limited digital exposure.

With the rapid expansion of mobile connectivity and digital infrastructure in rural regions, there is a significant opportunity to leverage technology to bridge these long-standing gaps. The Indian government's Digital India initiative and the proliferation of affordable smartphones have created an environment conducive to technology-driven agricultural solutions.

### 1.2 Motivation

The motivation for developing Farm Connect stems from several critical observations:

1. **Information Asymmetry:** Farmers often lack access to real-time market prices, leading to exploitation by middlemen and reduced profit margins.

2. **Disease Management Challenges:** Delayed disease identification results in crop losses averaging 15-25% annually. Early detection through AI can significantly reduce these losses.

3. **Underutilization of Government Schemes:** Despite numerous agricultural support programs, awareness and accessibility remain low among rural farmers.

4. **Weather Vulnerability:** Unpredictable weather patterns and lack of timely alerts contribute to crop failures and financial losses.

5. **Equipment Access Barriers:** High costs of agricultural machinery prevent small farmers from modernizing their practices.

### 1.3 Need for Farm Connect

In response to these needs, the proposed system **Farm Connect: Pathway to Progress** seeks to provide a comprehensive, user-friendly, and regionally adaptable digital platform designed specifically for Indian farmers. The platform aims to integrate:

- Real-time weather updates with agricultural insights
- AI-powered pest and disease detection and alerts
- User profile and booking management
- Government schemes and subsidy information
- Agricultural machinery rental marketplace
- Voice-enabled multilingual interface

### 1.4 Theoretical Foundation

The theoretical foundation of this research draws upon established frameworks such as:

- **Diffusion of Innovations Theory (Rogers, 2003):** Explains technology adoption patterns and how innovations spread through social systems.

- **Technology Acceptance Model (TAM):** Focuses on perceived usefulness and ease of use as primary determinants of technology adoption.

- **Information Systems Success Model (DeLone & McLean):** Emphasizes system quality, information quality, and service quality as key factors in system success.

- **Socio-Technical Systems Theory:** Underlines the importance of alignment between technology and users' cultural and social environments.

These models collectively guide the design, implementation, and evaluation of Farm Connect.

### 1.5 Scope of the Project

The scope of Farm Connect encompasses:

1. **AI-Powered Disease Detection Module:** Image analysis using configurable AI providers (Groq LLM by default; optionally Google Gemini Vision AI)
2. **Smart Weather Dashboard:** Integration with WeatherAPI for real-time forecasting
3. **Machinery Marketplace:** Peer-to-peer equipment rental platform
4. **Government Schemes Portal:** Database of agricultural subsidies and support programs
5. **User Profile:** Personal dashboard with booking history and preferences
6. **AI Chatbot (Voice & Text):** Multilingual assistant supporting Hindi, Marathi, Malayalam, Punjabi, and English - farmers can ask questions via voice or text input, with AI-powered responses from Groq LLM by default (Google Gemini is also supported) and text-to-speech output
7. **User Authentication:** Secure login system with JWT token authentication

**Page 1**










---

## 2. LITERATURE SURVEY

A comprehensive review of existing literature was conducted to understand the current state of agricultural technology, identify gaps, and inform the design of Farm Connect.

### 2.1 IoT-Based Smart Agriculture Systems

**Patil & Deshmukh (2021)** present an IoT-based smart agriculture framework that uses sensors to monitor soil moisture, temperature, humidity, and environmental conditions. Their study highlights how real-time data collection and automated alerts enable farmers to take timely decisions, improving crop health and reducing resource wastage. The system demonstrates how IoT can reduce labor dependency while supporting precision farming practices. The paper also identifies common barriers such as cost, connectivity issues, and sensor calibration.

**Rao & Kumar (2022)** focus on creating a cost-effective agricultural monitoring system using affordable sensors and microcontrollers. Their research demonstrates that even smallholder farmers can benefit from digital tools when designed with affordability and simplicity in mind. By integrating sensors like DHT11 and soil moisture probes, the system automates irrigation decisions and provides continuous environmental updates.

**Relevance to Farm Connect:** These studies support real-time monitoring, advisory generation, and the integration of low-cost solutions in digital agriculture platforms. Farm Connect incorporates weather monitoring and agricultural alerts as core features.

### 2.2 Digital Agricultural Marketplaces

**Ministry of Agriculture (2020)** evaluates the impact of eNAM (electronic National Agriculture Market) on agricultural trade. The report highlights how eNAM improves transparency, market competitiveness, and access to national buyers, reducing dependence on middlemen. However, operational constraints such as inadequate grading, digital literacy gaps, and infrastructural limitations remain challenges.

**Mishra & Tiwari (2020)** assess the impact of digital supply chain platforms on agricultural logistics and market efficiency. Their study demonstrates that digital integration reduces post-harvest losses, improves price discovery, and enhances coordination between farmers, traders, and transporters.

**Relevance to Farm Connect:** The Machinery Marketplace module in Farm Connect addresses these findings by providing a simplified peer-to-peer equipment rental platform that reduces barriers to equipment access for farmers.

### 2.3 Mobile-Based Agricultural Extension

**Singh & Mehta (2021)** analyze several mobile applications used in agricultural extension and find common issues such as language barriers, fragmented data, poor interface design, and inconsistent content quality. Their study reveals that farmers tend to abandon apps that lack clarity, reliability, or local-language support.

**Kumar & Verma (2022)** assess the adoption and impact of mobile-based extension services across Indian farming communities. Their results indicate that mobile advisories significantly improve farmers' knowledge and decision-making related to crop management, input selection, and risk mitigation. The study identifies trust, clarity of information, and source credibility as strongest determinants of adoption.

**Relevance to Farm Connect:** These insights directly strengthen Farm Connect's focus on inclusive, local-language, user-centered design with clear interfaces and reliable content.

### 2.4 Voice Technology for Low-Literacy Users

**Google Research Team (2019)** studies voice interface adoption among low-literacy users in developing regions. It highlights that voice technology significantly reduces barriers to digital engagement by offering a natural, intuitive mode of interaction. However, challenges remain in handling diverse accents, dialect variations, and noisy environments.

**Medhi, Sagar & Toyama (2011)** explore the effectiveness of text-free user interfaces for low-literate populations, demonstrating how icons, visuals, and guided navigation can dramatically improve usability.

**Relevance to Farm Connect:** These findings are crucial to Farm Connect's voice-enabled interface, which aims to serve semi-literate farmers through voice navigation and content retrieval.

**Page 2**










### 2.5 Weather-Based Agricultural Advisory Systems

**Hansen & Coffey (2020)** emphasize the importance of integrating weather forecasts, climate predictions, and advisory systems to mitigate agricultural risks. Their study examines how timely, localized weather information helps farmers plan irrigation, fertilizer use, and pest control strategies.

**Sharma & Rao (2021)** examine the effectiveness of Weather-Based Agro-Advisory Services (WBAAS) and their role in improving farming outcomes. Their findings show that farmers who regularly receive weather-based recommendations experience fewer losses related to unexpected rainfall, pests, and climatic variability.

**Verma & Singh (2021)** evaluate weather forecast-based decision support systems. Their findings reveal that farmers using predictive weather tools improve crop scheduling, reduce pest damage, and enhance fertilizer efficiency.

**Relevance to Farm Connect:** These studies validate Farm Connect's Smart Weather Dashboard, which combines real-time forecasts with crop-specific recommendations and agricultural alerts.

### 2.6 AI-Based Crop Disease Detection

**Choudhary & Jain (2022)** analyze the application of artificial intelligence in crop disease detection using image processing and machine learning models. Their research demonstrates that AI-based systems can accurately identify early-stage crop diseases, enabling timely preventive action.

**Khattab et al. (2019)** present an IoT-based cognitive monitoring system for early plant disease detection. The study highlights the potential of combining sensor data with AI for comprehensive crop health monitoring.

**Saini et al. (2025)** propose a smart crop disease monitoring system using deep learning in IoT environments, demonstrating high accuracy in disease classification.

**Relevance to Farm Connect:** These studies directly inform Farm Connect's AI Disease Detection module, which supports configurable AI providers for image-based disease identification and treatment recommendations (Groq LLM is used by default; Google Gemini Vision AI is available as an alternate provider).

### 2.7 Digital Literacy and Technology Adoption

**Narayanan & Iyer (2021)** investigate how digital literacy levels influence technology adoption in rural India. Their findings reveal that lack of basic smartphone skills limits farmers' ability to utilize advanced digital services. The study stresses the importance of training programs, voice-based systems, and assisted digital onboarding.

**Joshi & Kulkarni (2022)** analyze behavioral factors influencing farmers' adoption of mobile advisory services in India. Their findings show that ease of use, trust in information sources, and language compatibility play crucial roles in sustained app usage.

**Relevance to Farm Connect:** These findings reinforce Farm Connect's emphasis on voice interfaces, guided navigation, and digital inclusion strategies.

### 2.8 Government Scheme Awareness

**FAO (2021)** highlights how digital agriculture solutions such as mobile advisory services, e-markets, and remote sensing are transforming farming in developing nations. The study emphasizes the importance of digital capacity building and gender-inclusive technology access.

**Coggins et al. (2022)** examine how smallholder farmers in Bihar, India use digital extension tools, identifying key barriers and success factors.

**Relevance to Farm Connect:** The Government Schemes Portal module addresses these findings by providing simplified access to scheme information with search and filtering functionality.

**Page 3**










### 2.9 Summary of Literature Review

| Research Area | Key Findings | Application in Farm Connect |
|---------------|--------------|----------------------------|
| Weather-Based Advisory | Real-time data improves crop health | Weather Dashboard, Alerts System |
| Digital Marketplaces | Reduces middlemen, improves price discovery | Machinery Marketplace (equipment sharing) |
| Mobile Extension | Language support crucial for adoption | Multilingual support (Hindi, Marathi, Malayalam, Punjabi, English) |
| Voice Technology | Reduces barriers for low-literacy users | Voice Interface with speech recognition |
| Weather Advisory | Timely alerts reduce crop losses | Smart Weather Dashboard with AI insights |
| AI Disease Detection | Early detection enables preventive action | Groq  or Gemini Vision AI  |
| Digital Literacy | Simplified UX increases adoption | Icon-based navigation, voice commands |
| Government Schemes | Awareness gaps limit utilization | Schemes Portal with search and filtering |

### 2.10 Research Gap

Despite significant advancements in agricultural technology, a notable gap exists in the availability of integrated platforms that combine:

1. **AI-powered disease detection** with immediate treatment recommendations
2. **Real-time weather alerts** with agriculture-specific actionable insights
3. **Government scheme information** with simplified access and search
4. **Voice-enabled interfaces** for low-literacy users

Most existing solutions address only one or two of these aspects. Farm Connect aims to bridge this gap by providing a unified platform that addresses all these needs through a single, accessible interface.

**Page 4**










---

## 3. PROJECT OBJECTIVES

The primary objectives of the Farm Connect project are designed to address the critical challenges faced by Indian farmers through an integrated digital platform.

### 3.1 Primary Objectives

1. **To develop an integrated digital platform** that connects farmers with essential agricultural resources and services through a single unified interface.

2. **To provide AI-based crop disease detection** for improved decision-making using configurable AI providers (Groq LLM by default; optionally Google Gemini Vision AI) with treatment recommendations and prevention strategies.

3. **To deliver real-time weather updates** with agricultural insights, farming alerts, and actionable recommendations for irrigation, pest control, and crop protection.

4. **To create a unified platform** that integrates all essential agricultural services into a single accessible interface.

5. **To provide a machinery rental marketplace** enabling farmers to access agricultural equipment without significant capital investment.

### 3.2 Secondary Objectives

6. **To include a multilingual, voice-enabled interface** to ensure accessibility for farmers of all literacy levels, supporting Hindi, Marathi, Malayalam, Punjabi, and English.

7. **To offer consolidated information on government schemes**, subsidies, and agricultural support programs with search and filtering functionality.

8. **To issue weather-based farming alerts** for adverse weather conditions based on real-time weather data.

9. **To build a secure authentication system** with JWT token-based security for user protection.

10. **To develop a secure, scalable, and user-friendly platform** capable of supporting large numbers of rural users with responsive design for mobile accessibility.

### 3.3 Technical Objectives

11. **To implement a modern tech stack** using React.js for frontend, Node.js/Express for backend, and MongoDB for database management.

12. **To integrate third-party APIs** including WeatherAPI for weather data, Groq LLM  and Google Gemini AI  for disease detection and farming advice.

13. **To ensure PWA (Progressive Web App) capabilities** for offline functionality and mobile installation.

14. **To create RESTful API architecture** for seamless communication between frontend and backend services.

**Page 5**










---

## 4. PROBLEM FORMULATION

### 4.1 Existing System

The existing agricultural support system in India suffers from major fragmentation and inaccessibility:

#### 4.1.1 Information Fragmentation
- Government schemes, market prices, and weather updates are available across multiple platforms with no unified source
- Farmers must navigate numerous websites, apps, and offices to access different services
- Information is often outdated, inconsistent, or difficult to understand

#### 4.1.2 Language Barriers
- Most agricultural apps operate primarily in English or Hindi
- Regional language support is limited or poorly implemented
- Text-heavy interfaces exclude farmers with limited literacy

#### 4.1.3 Disease Detection Challenges
- Manual disease identification requires expert knowledge not readily available in rural areas
- By the time farmers identify diseases, significant crop damage has often occurred
- Existing solutions require expensive equipment or specialized training

#### 4.1.4 Market Access Issues
- Farmers depend heavily on middlemen who often exploit information asymmetry
- Real-time price information is not accessible to most farmers
- Direct buyer connections are rare for small and marginal farmers

#### 4.1.5 Equipment Accessibility
- High costs of agricultural machinery prevent modernization
- No organized platform exists for equipment sharing or rental
- Underutilization of existing machinery in rural communities

#### 4.1.6 Government Scheme Awareness
- Low awareness of available subsidies and support programs
- Complex application processes discourage participation
- Eligibility criteria are often unclear or difficult to verify

**Page 6**










### 4.2 Proposed System

The proposed system, **Farm Connect**, aims to address all limitations of current agricultural information platforms by creating a unified, intelligent, and accessible digital ecosystem for farmers.

#### 4.2.1 System Overview

Farm Connect is a responsive web application built using:
- **Frontend:** React.js with TypeScript, Tailwind CSS, Shadcn/UI components
- **Backend:** Node.js with Express.js
- **Database:** MongoDB for flexible data storage
- **AI Services:** Groq LLM and Google Gemini AI for disease detection and farming advice
- **Weather API:** WeatherAPI.com for real-time weather data

#### 4.2.2 Core Modules

| Module | Description | Key Features |
|--------|-------------|--------------|
| **Disease Detection** | AI-powered crop disease identification | Image upload, instant analysis, treatment recommendations |
| **Weather Dashboard** | Real-time weather with farming insights | 7-day forecast, farming alerts, crop advisory |
| **Machinery Marketplace** | Equipment rental platform | Browse, book, review machinery |
| **Government Schemes** | Subsidy and scheme information | Search, filter, category browsing, scheme details |
| **Voice Interface** | Multilingual voice assistant | Speech recognition, voice responses |
| **User Profile** | Personal dashboard | Booking history, preferences |

#### 4.2.3 Key Innovations

1. **Unified Platform:** Single interface for all agricultural needs
2. **AI-First Approach:** AI-based disease detection using Groq  and Gemini Vision AI  for accurate diagnosis and recommendations
3. **Voice Accessibility:** Natural language interaction for low-literacy users
4. **Real-time Data:** Live weather updates with agricultural context
5. **Direct Market Access:** Peer-to-peer machinery sharing

#### 4.2.4 Expected Benefits

- Reduced crop losses through early disease detection (estimated 15-20% improvement)

- Increased scheme utilization through simplified access
- Reduced equipment costs through machinery sharing
- Improved decision-making through weather-based advisory

**Page 7**










---

## 5. RESEARCH METHODOLOGY & PROPOSED SOLUTION

The research methodology for Farm Connect follows a systematic and structured approach combining software engineering principles with user-centered design practices.

### 5.1 Development Methodology

Farm Connect was developed using an **Agile Scrum** methodology with the following phases:

#### Phase 1: Requirements Gathering
- Stakeholder interviews with farmers and agricultural experts
- Analysis of existing agricultural applications and their limitations
- Documentation of functional and non-functional requirements

#### Phase 2: System Design
- Architecture design using modular component-based approach
- Database schema design for MongoDB collections
- API endpoint design for RESTful services
- UI/UX wireframing and prototyping

#### Phase 3: Iterative Development
- Sprint-based development cycles (2-week sprints)
- Iterative development with local testing 
- Regular stakeholder feedback and iteration

#### Phase 4: Testing & Deployment
- Local testing 
- Cloud deployment and performance optimization via Vercel/Netlify/Render configurations

### 5.2 Data Collection Methods

| Method | Purpose | Data Collected |
|--------|---------|----------------|
| Farmer Surveys | Understanding user needs | Pain points, feature requests, literacy levels |
| Expert Interviews | Domain knowledge | Disease patterns, farming practices, seasonal variations |
| API Integration | Real-time data | Weather data, government scheme information |
| Literature Review | Best practices | Technology trends, existing solutions |

**Page 8**










### 5.3 System Architecture

#### 5.3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   React.js  │  │ TypeScript  │  │ Tailwind CSS│              │
│  │   Frontend  │  │   Logic     │  │   Styling   │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API LAYER                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Express.js │  │  REST APIs  │  │  Auth/JWT   │              │
│  │   Server    │  │  Endpoints  │  │  Middleware │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Groq &  │  │  Weather │  │ MongoDB  │  │ Support  │         │
│  │  Gemini  │  │   API    │  │ Database │  │  PWA     │         │
│  │  AI API  │  │          │  │          │  │          │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

#### 5.3.2 Component Architecture

| Layer | Components | Technologies |
|-------|------------|--------------|
| **Presentation** | Pages, Components, UI Elements | React.js, Shadcn/UI, Lucide Icons |
| **State Management** | Context API | React Context |
| **Routing** | Page Navigation | React Router DOM |
| **API Communication** | HTTP Client | Fetch API |
| **Backend Services** | REST APIs | Express.js, Node.js |
| **Database** | Data Persistence | MongoDB |
| **External APIs** | Third-party Services | WeatherAPI, Groq LLM, Google Gemini AI |

#### 5.3.3 Layer-wise Code Implementation

The following code snippets demonstrate how each layer of the 3-tier architecture is implemented in Farm Connect:

---

**1. CLIENT LAYER (React.js Frontend)**

The client layer handles user interface, state management, and API communication. Below is a snippet from the Machinery Marketplace page showing React component structure with hooks and service integration:

```typescript
// src/pages/MachineryMarketplace.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { machineryService } from '@/lib/api/machineryService';
import { MachinerySchema } from '@/lib/schemas/machinery.schema';

export default function MachineryMarketplace() {
  const [machinery, setMachinery] = useState<MachinerySchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  // Fetch machinery from backend API
  useEffect(() => {
    fetchMachinery();
  }, [searchTerm, filterType]);

  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const response = await machineryService.getMachinery({
        search: searchTerm || undefined,
        type: filterType !== 'all' ? filterType : undefined,
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      if (response.success) {
        setMachinery(response.data);
      }
    } catch (error) {
      console.error('Error fetching machinery:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">🚜 Machinery Marketplace</h1>
      {/* UI components render machinery data */}
    </div>
  );
}
```

**Client-side API Service Layer:**

```typescript
// src/lib/api/machineryService.ts
const API_BASE_URL = '/api';

class MachineryService {
  // Get all machinery with filters
  async getMachinery(filters = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    const response = await fetch(`${API_BASE_URL}/machinery?${queryParams}`);
    return await response.json();
  }

  // Get single machinery by ID
  async getMachineryById(id: string) {
    const response = await fetch(`${API_BASE_URL}/machinery/${id}`);
    return await response.json();
  }

  // Create new machinery listing
  async createMachinery(machineryData) {
    const response = await fetch(`${API_BASE_URL}/machinery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(machineryData),
    });
    return await response.json();
  }
}

export const machineryService = new MachineryService();
```

---

**2. API LAYER (Express.js REST Endpoints)**

The API layer provides RESTful endpoints that handle HTTP requests, apply business logic, and interact with the database. Below is the weather API endpoint implementation:

```javascript
// api/weather.js
import express from 'express';
import axios from 'axios';

const router = express.Router();
const BASE_URL = 'http://api.weatherapi.com/v1';

// GET /api/weather/forecast - Get weather forecast
router.get('/forecast', async (req, res) => {
  try {
    const { q, days = 7 } = req.query;
    const apiKey = process.env.WEATHER_API;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Weather API key not configured'
      });
    }

    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: { key: apiKey, q, days, aqi: 'yes', alerts: 'yes' }
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error fetching weather:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch weather' });
  }
});

export default router;
```

**Machinery API with Database Operations:**

```javascript
// api/machinery.js
import express from 'express';
import { getDatabase, collections } from '../database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// GET /api/machinery - Get all machinery with filters
router.get('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const machineryCollection = db.collection(collections.machinery);
    const { 
      type, location, minPrice, maxPrice, minRating, available,
      search, sortBy = 'createdAt', sortOrder = 'desc',
      page = 1, limit = 12 
    } = req.query;

    // Build filter query
    const filter = { isActive: true };
    if (type && type !== 'all') filter.type = type;
    if (location && location !== 'all') {
      filter['location.state'] = { $regex: location, $options: 'i' };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const machinery = await machineryCollection
      .find(filter).sort(sort).skip(skip).limit(parseInt(limit)).toArray();
    const total = await machineryCollection.countDocuments(filter);

    res.json({
      success: true,
      data: machinery,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch machinery' });
  }
});

// POST /api/machinery - Create new machinery
router.post('/', async (req, res) => {
  try {
    const db = await getDatabase();
    const machineryData = {
      ...req.body,
      rating: 0,
      totalReviews: 0,
      bookedDates: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      views: 0,
      totalBookings: 0
    };
    const result = await db.collection(collections.machinery).insertOne(machineryData);
    res.status(201).json({ success: true, data: { _id: result.insertedId, ...machineryData } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create machinery' });
  }
});

export default router;
```

---

**3. SERVICE LAYER (External Services & Database)**

The service layer integrates external APIs (AI, Weather) and database connections that power the application's core features. Farm Connect supports **two AI providers**: Groq LLM (primary) and Google Gemini (alternate).

**Groq LLM AI Service (Primary Provider):**

```typescript
// src/lib/groq.ts
import OpenAI from 'openai';

class GroqAIService {
  private getClient() {
    const apiKey = localStorage.getItem('groq_api_key') || '';
    return new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async analyzeCropImage(imageBase64: string): Promise<AICropAnalysis> {
    const response = await this.getClient().chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: "Analyze this crop for diseases..." },
          { type: "image_url", image_url: { url: imageBase64 } }
        ]
      }],
      max_tokens: 1500,
      temperature: 0.2,
    });
    return JSON.parse(response.choices[0]?.message?.content || '');
  }

  async getFarmingAdvice(query: string, language: string): Promise<{ response: string }> {
    const completion = await this.getClient().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a farming assistant for Indian farmers." },
        { role: "user", content: query }
      ],
      temperature: 0.7,
    });
    return { response: completion.choices[0]?.message?.content?.trim() || '' };
  }
}

export const groqAI = new GroqAIService();
```

**Google Gemini AI Service (Alternate Provider):**

```typescript
// src/lib/gemini.ts
import { GoogleGenAI, Type } from '@google/genai';

class GeminiAIService {
  private getModel() {
    const apiKey = localStorage.getItem('gemini_api_key') || '';
    return new GoogleGenAI({ apiKey });
  }

  async analyzeCropImage(imageBase64: string): Promise<AICropAnalysis> {
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const response = await this.getModel().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: 'Analyze this crop image for diseases...' },
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });
    return JSON.parse(response.text.trim());
  }

  async getFarmingAdvice(query: string, language: string): Promise<string> {
    const result = await this.getModel().models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: { parts: [{ text: `Farming advice in ${language}: ${query}` }] },
      config: { temperature: 0.7 }
    });
    return result.text.trim();
  }
}

export const geminiAI = new GeminiAIService();
```

**AI Provider Configuration (Supports Both Groq & Gemini):**

```typescript
// src/lib/ai.ts - Centralized AI provider management
import { geminiAI, AICropAnalysis } from './gemini';
import { groqAI } from './groq';

export type ModelProvider = 'gemini' | 'groq';

export interface ModelConfig {
    diseaseDetection: ModelProvider;
    chatbot: ModelProvider;
}

const SETTINGS_KEY = 'farm-connect-model-settings';

// Get user's configured AI provider from settings
export const getModelConfig = (): ModelConfig => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : { diseaseDetection: 'groq', chatbot: 'groq' };
};

// Save user's AI provider preference
export const saveModelConfig = (config: ModelConfig): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));
};

// Centralized crop disease analysis - uses configured provider
export const analyzeCropImage = async (imageBase64: string): Promise<AICropAnalysis> => {
    const provider = getModelConfig().diseaseDetection;
    return provider === 'groq' 
        ? groqAI.analyzeCropImage(imageBase64)
        : geminiAI.analyzeCropImage(imageBase64);
};

// Centralized farming advice - uses configured provider
export const getFarmingAdvice = async (query: string, language: string): Promise<{ response: string }> => {
    const provider = getModelConfig().chatbot;
    if (provider === 'groq') {
        return groqAI.getFarmingAdvice(query, language);
    } else {
        const result = await geminiAI.getFarmingAdvice(query, language);
        return { response: result.response };
    }
};

// Centralized AI insights - uses configured provider
export const getAIInsights = async (prompt: string): Promise<string[]> => {
    const provider = getModelConfig().chatbot;
    if (provider === 'groq') {
        const groqApiKey = localStorage.getItem('groq_api_key');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are an agricultural expert.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
            }),
        });
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        return content.split('\n').filter((line: string) => line.trim().length > 10);
    } else {
        const { getAIInsights: geminiInsights } = await import('./gemini');
        return geminiInsights(prompt);
    }
};
```

**Weather Service Using Configurable AI:**

```typescript
// src/lib/weather.ts
import { getAgriculturalInsightsAI } from './ai';

// AI-powered agricultural insights using configured provider (Groq or Gemini)
export const getAgriculturalInsights = async (weather: WeatherData): Promise<string[]> => {
  const weatherContext = `
    Location: ${weather.location}
    Temperature: ${weather.temperature}°C
    Humidity: ${weather.humidity}%
    Wind Speed: ${weather.windSpeed} km/h
    Precipitation: ${weather.precipitation} mm
    Condition: ${weather.condition}
  `;

  try {
    const insights = await getAgriculturalInsightsAI(weatherContext);
    return Array.isArray(insights) && insights.length > 0 
      ? insights 
      : getBasicInsights(weather);
  } catch (error) {
    return getBasicInsights(weather); // Fallback on error
  }
};

// Fallback basic insights when AI is unavailable
const getBasicInsights = (weather: WeatherData): string[] => {
  const insights: string[] = [];
  
  if (weather.temperature > 35) insights.push('🌡️ High temperature - increase irrigation');
  if (weather.humidity > 80) insights.push('💧 High humidity - monitor for diseases');
  if (weather.precipitation > 10) insights.push('🌧️ Heavy rain - ensure proper drainage');
  
  return insights.length > 0 ? insights : ['🌾 Normal farming conditions'];
};
```

**MongoDB Database Connection:**

```javascript
// database.js
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true }
});

let db = null;

export async function connectToDatabase() {
  if (db) return db;
  await client.connect();
  db = client.db("FarmConnect");
  console.log("Successfully connected to MongoDB!");
  return db;
}

export async function getDatabase() {
  if (!db) await connectToDatabase();
  return db;
}

// Collection names
export const collections = {
  users: 'users',
  farms: 'farms',
  machinery: 'machinery',
  schemes: 'schemes',
  bookings: 'bookings',
  diseases: 'diseases',
  predictions: 'predictions',
  reviews: 'reviews',
  messages: 'messages',
  conversations: 'conversations'
};
```

**PWA Service Worker Registration:**

```typescript
// src/registerSW.ts
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered:', registration);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, prompt user to refresh
              console.log('New content available, please refresh.');
            }
          });
        });
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    });
  }
}

// Check if app is installed as PWA
export function isPWAInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
}
```

---

### 5.4 Module Implementation Details

#### 5.4.1 AI Disease Detection Module

**Technology:** Groq LLM and Google Gemini Vision AI (gemini-2.5-flash for vision, gemini-2.5-flash-lite for text)

**Process Flow:**
1. User uploads crop image via drag-and-drop or file selection
2. Image is converted to Base64 format
3. Image sent to the selected AI provider (Groq or Gemini) with a structured prompt
4. AI analyzes image for diseases and pest infestations
5. Response includes disease name, confidence, severity, treatment, prevention
6. Results displayed with visual indicators and actionable recommendations

**Key Features:**
- Support for JPEG, PNG, WebP image formats
- Detection of both diseases AND pest infestations
- Treatment recommendations with locally available solutions
- Detection history stored for user reference

**Page 9**










#### 5.4.2 Smart Weather Dashboard Module

**Technology:** WeatherAPI.com integration with AI-powered insights

**Features:**
- Real-time current weather conditions
- 7-day weather forecast
- Agricultural-specific metrics (humidity, temperature, wind speed)
- AI-generated farming recommendations based on conditions
- Automatic farming alerts (high rainfall, pest conditions, spraying windows)
- City search functionality
- Geolocation-based automatic detection

**Data Points Displayed:**
| Metric | Description | Agricultural Relevance |
|--------|-------------|----------------------|
| Temperature | Current temperature | Crop stress indicators |
| Humidity | Relative humidity level | Disease risk assessment |
| Wind Speed | km/h | Spraying conditions |
| Visibility | Distance visibility (km) | Fieldwork conditions |
| UV Index | Solar radiation level | Crop protection timing |
| Sunrise/Sunset | Daily sun times | Field work planning |

#### 5.4.3 Machinery Marketplace Module

**Features:**
- Equipment listing with images and specifications
- Category-based filtering (Tractors, Harvesters, Sprayers, etc.)
- Location-based search
- Booking system with date selection
- Owner dashboard for equipment management
- Review and rating system
- Messaging between farmers and owners

**Database Collections:**
- `machinery`: Equipment listings
- `bookings`: Rental bookings
- `reviews`: User reviews
- `messages`: Communication threads

**Page 10**










#### 5.4.4 Government Schemes Portal Module

**Features:**
- Comprehensive database of central and state schemes
- Category filtering (Irrigation, Seeds, Livestock, Credit, etc.)
- State-wise scheme filtering
- Scheme details and benefits display
- Status indicators (Active, Deadline Soon, Closed)

**Scheme Categories Covered:**
1. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)
2. PMFBY (Pradhan Mantri Fasal Bima Yojana)
3. Kisan Credit Card
4. Soil Health Card Scheme
5. National Mission on Sustainable Agriculture
6. State-specific subsidy programs

**Note:** Uses curated static data that is regularly updated by the team to ensure accuracy and relevance of scheme information.

#### 5.4.5 Voice Interface Module

**Technology:** Web Speech API (browser native) with AI-powered response generation

**Supported Languages:**
- Hindi (hi-IN)
- Marathi (mr-IN)  
- English (en-IN)
- Malayalam (ml-IN)
- Punjabi (pa-IN)

**Capabilities:**
- Voice-to-text input using Web Speech API
- AI-powered intelligent farming advice and recommendations
- Text-to-speech output using Speech Synthesis API
- Multilingual support for accessibility

**Note:** Uses Groq LLM by default for intelligent response generation and farming advice; Google Gemini AI is also supported as an alternate provider.

**Page 11**










### 5.5 Database Design

#### 5.5.1 MongoDB Collections Schema

**Users Collection:**
```javascript
{
  _id: ObjectId,                 // Unique identifier
  name: String,                  // Full name of user
  email: String,                 // Email address (unique)
  phone: String,                 // Phone number
  password: String,              // Hashed with bcrypt
  location: String,              // User's location/city
  language: String,              // Preferred language: hi, mr, en, ml, pa
  farmSize: Number,              // Farm size in acres
  crops: [String],               // Crops grown by farmer
  createdAt: Date,               // Account creation timestamp
  updatedAt: Date                // Last profile update
}
```

**Machinery Collection:**
```javascript
{
  _id: ObjectId,                 // Unique identifier
  ownerId: String,               // Reference to owner user
  ownerName: String,             // Owner's display name
  name: String,                  // Equipment name (e.g., "John Deere 5050D")
  type: String,                  // Category: tractor, harvester, rotavator, etc.
  description: String,           // Detailed equipment description
  pricePerDay: Number,           // Daily rental rate in INR
  location: {
    address: String,             // Street address
    city: String,                // City name
    state: String,               // State name
    pincode: String              // PIN code for location filtering
  },
  images: [String],              // Array of image URLs
  features: [String],            // Equipment features list
  specifications: [{ key: String, value: String }],  // Technical specs
  available: Boolean,            // Current availability status
  rating: Number,                // Average rating (0-5)
  totalReviews: Number,          // Count of reviews
  bookedDates: [{                // Periods when machinery is booked
    startDate: Date,
    endDate: Date,
    bookingId: String
  }],
  createdAt: Date,               // Record creation timestamp
  updatedAt: Date,               // Last modification timestamp
  isActive: Boolean              // Soft delete flag
}
```

**Bookings Collection:**
```javascript
{
  _id: ObjectId,                 // Unique identifier
  bookingNumber: String,         // Unique reference (e.g., BK-xxx)
  machineryId: String,           // Reference to machinery
  machineryName: String,         // Machinery name (denormalized)
  ownerId: String,               // Machinery owner ID
  ownerName: String,             // Owner name (denormalized)
  renterId: String,              // Farmer who rents
  renterName: String,            // Renter name (denormalized)
  renterPhone: String,           // Contact number for renter
  startDate: Date,               // Rental start date
  endDate: Date,                 // Rental end date
  totalDays: Number,             // Duration in days
  pricePerDay: Number,           // Daily rate at booking time
  totalAmount: Number,           // Base amount (days × rate)
  deliveryRequired: Boolean,     // Whether delivery is requested
  deliveryAddress: String,       // Delivery location
  deliveryCharge: Number,        // Calculated delivery cost
  securityDeposit: Number,       // From machinery record
  discount: Number,              // Applied discount (if any)
  finalAmount: Number,           // Total after all charges/discounts
  purpose: String,               // Booking purpose/notes
  specialRequirements: String,   // Any special handling requests
  paymentMode: String,           // Payment method: demo, razorpay, cash
  status: String,                // pending | confirmed | rejected | in-progress | completed | cancelled | refunded
  paymentStatus: String,         // pending | paid | failed | refunded | partial
  createdAt: Date,               // Booking creation timestamp
  updatedAt: Date                // Last modification timestamp
}
```

**Page 12**










### 5.6 API Design

#### 5.6.1 RESTful API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User authentication |
| `/api/machinery` | GET/POST | List / Add machinery |
| `/api/machinery/:id` | GET/PUT/DELETE | View / Update / Remove machinery |
| `/api/bookings` | GET/POST | View / Create bookings |
| `/api/reviews` | GET/POST | View / Submit reviews |
| `/api/messages` | GET/POST | View / Send messages |
| `/api/weather/forecast` | GET | Weather forecast data |

#### 5.6.2 External API Integrations

**Supported AI Providers:**
- **Groq LLM :** Primary provider for chatbot and disease-detection flows using Groq's OpenAI-compatible endpoints.
- **Google Gemini Vision AI :** Models: gemini-2.5-flash (vision) and gemini-2.5-flash-lite (text); supports vision and text generation via `generateContent` with structured JSON schema responses when configured.

**WeatherAPI.com:**
- Endpoint: /v1/forecast.json
- Parameters: location, days, aqi, alerts
- Response: Current conditions + forecast

### 5.7 Security Implementation

| Security Measure | Implementation |
|-----------------|----------------|
| Password Hashing | bcrypt with salt rounds (10) |
| API Authentication | JWT tokens (7-day expiry) |
| CORS Protection | Open CORS policy (Allow-Origin: *) |
| Input Validation | TypeScript interface validation |
| API Key Protection | Environment variables (.env) |

**Page 13**










### 5.8 User Interface Design

#### 5.8.1 Design Principles

1. **Simplicity:** Clean, uncluttered interfaces with clear navigation
2. **Accessibility:** Large touch targets, high contrast, voice alternatives
3. **Responsiveness:** Mobile-first design for smartphone access
4. **Localization:** Support for regional languages and cultural context
5. **Visual Hierarchy:** Important actions prominently displayed

#### 5.8.2 Key UI Components

| Component | Purpose | Design Considerations |
|-----------|---------|----------------------|
| Navigation | Page access | Bottom nav for mobile, sidebar for desktop |
| Cards | Information display | Visual hierarchy, scannable content |
| Forms | Data input | Large inputs, clear labels, validation feedback |
| Modals | Focused actions | Overlay with clear close options |
| Alerts | Notifications | Color-coded severity indicators |
| Charts | Data visualization | Simple, agriculture-relevant metrics |

#### 5.8.3 Color Scheme

| Color | Usage | CSS Value |
|-------|-------|----------|
| Primary Green | Actions, success | HSL(120 45% 35%) |
| Warning Yellow | Alerts, caution | HSL(45 90% 55%) |
| Danger Red | Errors, high severity | HSL(0 84% 60%) |
| Accent | Secondary actions | HSL(90 35% 75%) |
| Background | Page background | HSL(120 25% 97%) |
| Text Primary | Main content | HSL(120 15% 15%) |

### 5.9 Testing Strategy

| Testing Type | Tools | Coverage |
|-------------|-------|----------|
| Manual Testing | Browser DevTools | Component functionality |
| API Testing | Postman, Thunder Client | API endpoints |
| E2E Testing | Browser-based manual testing | User flows |
| Usability Testing | Farmer feedback sessions | UX validation |
| Performance Testing | Lighthouse | Load times, accessibility |

**Page 14**










---

## 6. HARDWARE AND SOFTWARE REQUIREMENTS

### 6.1 Hardware Requirements

#### 6.1.1 For Development Team

| Component | Minimum Specification | Recommended Specification |
|-----------|----------------------|---------------------------|
| Processor | Intel Core i5 (8th Gen) | Intel Core i7/AMD Ryzen 7 |
| RAM | 8 GB DDR4 | 16 GB DDR4 |
| Storage | 256 GB SSD | 512 GB SSD |
| Display | 1080p Full HD | 1440p+ with accurate colors |
| Network | Stable broadband (10 Mbps) | High-speed fiber (50+ Mbps) |

#### 6.1.2 For Testing Devices

| Device Type | Specifications |
|-------------|----------------|
| Android Smartphones | Android 7.0+, 2GB+ RAM, Chrome browser |
| iOS Devices | iOS 13+, Safari browser |
| Tablets | 8"+ screen, any modern browser |
| Desktop/Laptop | Any modern browser (Chrome, Firefox, Edge) |

#### 6.1.3 For End Users (Farmers)

| Component | Minimum Requirement |
|-----------|---------------------|
| Smartphone | Android 7.0+ or iOS 13+ |
| RAM | 2 GB minimum |
| Storage | 100 MB free space for PWA |
| Camera | 5 MP+ for disease detection photos |
| Internet | 3G/4G mobile data or WiFi |

#### 6.1.4 Server Infrastructure

| Component | Specification |
|-----------|---------------|
| Backend Hosting | Render (Node.js server) |
| Frontend Hosting | Vercel (Static/SSR) |
| Runtime | Node.js 18.x+ |
| Database | MongoDB Atlas (Cloud) |
| CDN | Content Delivery Network for fast global asset delivery |
| SSL | HTTPS encryption |

**Page 15**










### 6.2 Software Requirements

#### 6.2.1 Development Tools

| Category | Tools |
|----------|-------|
| Code Editor | Visual Studio Code |
| Version Control | Git, GitHub |
| API Testing | Postman, Thunder Client |
| Design | Figma, Draw.io, Lucidchart |
| Browser DevTools | Chrome DevTools, React DevTools |

#### 6.2.2 Programming Languages & Frameworks

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend Language | TypeScript | 5.x |
| Frontend Framework | React.js | 18.x |
| Build Tool | Vite | 5.x |
| CSS Framework | Tailwind CSS | 3.x |
| UI Components | Shadcn/UI, Radix UI | Latest |
| Backend Runtime | Node.js | 18.x+ |
| Backend Framework | Express.js | 4.x |
| Database | MongoDB | 6.x |

#### 6.2.3 Libraries & Packages

| Package | Purpose |
|---------|---------|
| axios | HTTP requests |
| react-router-dom | Client-side routing |
| @tanstack/react-query | Server state management |
| react-hook-form | Form handling |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |
| lucide-react | Icon library |
| recharts | Data visualization |
| openai | Groq LLM API integration |
| @google/genai | Google Gemini AI integration |


#### 6.2.4 External APIs & Services

| Service | Purpose | Provider |
|---------|---------|----------|
| AI/Vision API | Disease detection (image analysis) | Groq LLM / Google Gemini AI (gemini-2.5-flash, gemini-2.5-flash-lite) |
| Weather API | Real-time weather data | WeatherAPI.com |
| Speech Recognition | Voice input (STT) | Web Speech API (browser native) |
| Speech Synthesis | Voice output (TTS) | Speech Synthesis API (browser native) |
| Database Hosting | Cloud MongoDB | MongoDB Atlas |
| Deployment | Web hosting | Render (backend) / Vercel (frontend) |

**Page 16**










---

## 7. PLAN OF WORK

### 7.1 Project Timeline (Gantt Chart Overview)

| Sr. No. | Phase | Activities | Duration | Timeline |
|---------|-------|-----------|----------|----------|
| 1 | Topic Selection & Analysis | Selecting project theme, understanding farmer problems, identifying scope and objectives | 2 weeks | Aug 2025 |
| 2 | Literature Review | Studying research papers, agricultural platforms, government schemes, market systems | 3 weeks | Aug-Sep 2025 |
| 3 | Requirements Gathering | Collecting feature requirements, user needs through surveys and interviews | 2 weeks | Aug-Sep 2025 |
| 4 | Requirements Analysis | Analyzing requirements, identifying modules, preparing flowcharts | 2 weeks | Sep 2025 |
| 5 | SRS Documentation | Finalizing functional/non-functional requirements, completing documentation | 2 weeks | Sep 2025 |
| 6 | System Design | Designing architecture, DFDs, module interactions, technology selection | 3 weeks | Sep-Oct 2025 |
| 7 | Dataset Collection | Gathering weather data, market data, crop disease information from APIs | 3 weeks | Oct-Nov 2025 |
| 8 | AI Integration | Integrating AI providers (Groq default, Gemini optional), implementing disease detection logic | 4 weeks | Oct-Dec 2025 |
| 9 | Prototype Development | Building React frontend, implementing core features (login, dashboard, weather) | 6 weeks | Nov-Dec 2025 |
| 10 | Testing & Documentation | Preparing reports, testing, creating presentation materials | 4 weeks | Dec 2025-Jan 2026 |

### 7.2 Detailed Phase Breakdown

#### Phase 1: Topic Selection (Aug 2025)
- Team formation and role assignment
- Problem identification through farmer discussions
- Scope definition and feasibility study
- Initial project proposal preparation

#### Phase 2: Literature Review (Aug-Sep 2025)
- Review of IoT-based agriculture systems
- Study of existing agri-tech applications
- Analysis of government digital initiatives
- Documentation of research gap

#### Phase 3-5: Requirements & Design (Sep-Oct 2025)
- Stakeholder interviews and surveys
- Use case identification
- System requirement specification
- UI/UX wireframe design
- Database schema design
- API architecture planning

#### Phase 6-9: Development (Oct-Dec 2025)
- Frontend development with React
- Backend API development with Node.js
- MongoDB database implementation
 - AI providers integration (Groq LLM by default; Google Gemini AI optional)
- Weather API integration
- Voice interface implementation
- Iterative testing and bug fixes

#### Phase 10: Finalization (Dec 2025-Jan 2026)
- User acceptance testing
- Performance optimization
- Documentation completion
- Presentation preparation
- Final demonstration

**Page 17**










---

## 8. REFERENCES

### Books & Journals

[1] Rogers, E. M. (2003). *Diffusion of Innovations* (5th ed.). Free Press.

[2] Davis, F. D. (1989). Perceived Usefulness, Perceived Ease of Use, and User Acceptance of Information Technology. *MIS Quarterly*, 13(3), 319–340.

[3] DeLone, W. H., & McLean, E. R. (1992). Information Systems Success: The Quest for the Dependent Variable. *Information Systems Research*, 3(1), 60–95.

[4] Khattab, A., et al. (2019). An IoT-based Cognitive Monitoring System for Early Plant Disease Detection. *Computers and Electronics in Agriculture*, 153, 194–204.

### Government Publications & Reports

[5] Ministry of Agriculture, Government of India (2020). *e-National Agriculture Market (eNAM): Transforming Agricultural Markets*. Government of India Publication.

[6] FAO (2021). *Digital Agriculture Transformation in Developing Countries*. Food and Agriculture Organization.

[7] DARPG. *e-National Agriculture Market (eNAM)*. Government of India Publication.

### Research Papers

[8] Coggins, S., et al. (2022). How Have Smallholder Farmers Used Digital Extension Tools? A Mixed-Methods Study in Bihar, India. *PLOS ONE*, 17(9), e0269661.

[9] Patil, V., & Deshmukh, R. (2021). Smart Agriculture System Using IoT. *International Journal of Engineering Research*, 10(5), 234-241.

[10] Rao, S., & Kumar, P. (2022). Smart Agriculture Monitoring with Low-Cost Sensors. *Journal of Agricultural Informatics*, 13(2), 45-58.

[11] Singh, A., & Mehta, R. (2021). Mobile Apps for Agricultural Extension in India: A Critical Analysis. *Agricultural Extension Review*, 8(3), 112-125.

[12] Kumar, V., & Verma, S. (2022). Mobile-Based Agricultural Extension Services: Adoption and Impact. *Indian Journal of Agricultural Sciences*, 92(4), 567-574.

[13] Hansen, J., & Coffey, K. (2020). Climate Information for Agricultural Risk Management. *Climate Risk Management*, 28, 100219.

[14] Sharma, R., & Rao, M. (2021). Weather-Based Agro-Advisory Services and Their Impact on Farming Outcomes. *Agricultural Systems*, 189, 103056.

[15] Verma, A., & Singh, K. (2021). Impact of Weather Forecast-Based Decision Support Systems on Farm-Level Decision-Making. *Agricultural Water Management*, 252, 106871.

### Technical Resources

[16] Medhi, I., Sagar, A., & Toyama, K. (2011). Text-Free User Interfaces for Illiterate and Semi-literate Users. *Information Technologies & International Development*, 4(1), 37-50.

[17] Google Research Team (2019). Voice Access for the Next Billion Users. *Google AI Research Publication*.

[18] Choudhary, P., & Jain, A. (2022). AI-Based Crop Disease Detection Systems Using Deep Learning. *Artificial Intelligence in Agriculture*, 6, 1-15.

[19] Saini, A., et al. (2025). Smart Crop Disease Monitoring System using Deep Learning in IoT. *Scientific Reports*, 15, 85486.

[20] Narayanan, S., & Iyer, V. (2021). Digital Literacy and Rural Technology Adoption in India. *Information Development*, 37(3), 445-460.

[21] Joshi, P., & Kulkarni, S. (2022). Farmer Adoption of Mobile-Based Advisory Systems in India. *Journal of Agricultural Extension*, 26(2), 89-103.

[22] Mishra, D., & Tiwari, A. (2020). Digital Supply Chain Management in Agriculture. *Supply Chain Management Review*, 25(4), 34-48.

### Online Resources

[23] React.js Documentation. https://react.dev/

[24] MongoDB Documentation. https://www.mongodb.com/docs/

[25] Google Gemini AI Documentation. https://ai.google.dev/

[26] WeatherAPI Documentation. https://www.weatherapi.com/docs/

[27] MeasuringU. (2011). Measuring Usability with the System Usability Scale (SUS). https://measuringu.com/sus/

**Page 18**










---

## ACKNOWLEDGEMENT

We express our sincere gratitude to our project guide **Prof. Tejas Dhule** for his valuable guidance, constant encouragement, and support throughout the development of this project. His expertise and insights have been instrumental in shaping this work.

We are thankful to **Dr. [HOD Name]**, Head of the Department of Computer Science & Engineering, for providing the necessary facilities and resources.

We extend our gratitude to **Dr. [Principal Name]**, Principal of Nagpur Institute of Technology, for his continuous support and encouragement.

We would like to thank all the farmers who participated in our surveys and provided valuable feedback that helped shape the features of Farm Connect.

Finally, we thank our families and friends for their moral support and encouragement throughout this endeavor.

---

**Team Members:**
- Marshal Alone
- Aditya Kawale
- Vaishnavi Getme
- Sanskruti Patil
- Mrunali Umak

**Department of Computer Science & Engineering**
**Nagpur Institute of Technology**
**2025-2026**
