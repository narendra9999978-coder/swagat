import { ArchitectureNode } from '../types';

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'client-layer',
    label: 'Citizen Touchpoints (Omnichannel)',
    role: 'Responsive Web, Flutter Mobile, CSC Gram Panchayat Kiosks',
    tech: 'React 19 + TypeScript, Flutter, Offline-first PWA',
    group: 'client',
    description: 'Empowering urban citizens, rural panchayat entrepreneurs (VLEs), and field inspectors with low-bandwidth, multilingual interfaces.'
  },
  {
    id: 'auth-layer',
    label: 'Authentication & Identity Engine',
    role: 'Aadhaar eKYC, Face-Auth, DigiLocker OTR & JWT RBAC',
    tech: 'UIDAI eKYC API, IndiaStack JWT Session Engine',
    group: 'security',
    description: 'Enables paperless citizen verification with role-based access for citizens, department nodal officers, and state administrators.'
  },
  {
    id: 'api-layer',
    label: 'SWAGAT Journey Core API & Event Bus',
    role: 'Golang / Gin High-Throughput REST & GraphQL Service',
    tech: 'Go (Gin), NATS JetStream Event Queue, Redis Cache',
    group: 'api',
    description: 'Orchestrates real-time journey graph generation, rule-engine matching, SLA clock monitoring, and asynchronous background worker pipelines.'
  },
  {
    id: 'storage-layer',
    label: 'Encrypted Data & Document Vault',
    role: 'PostgreSQL Relational DB & S3/MinIO Encrypted Store',
    tech: 'PostgreSQL 16 (JSONB Schemas) + MinIO Object Store',
    group: 'gov_backend',
    description: 'Stores versioned journey state, audit logs, and encrypted temporary pre-application dossiers with zero unauthorized retention.'
  },
  {
    id: 'gateway-layer',
    label: 'Secure API Gateway & OpenGov Connectors',
    role: 'Kong / Apigee Enterprise Gateway with Mutual TLS',
    tech: 'Kong Enterprise, OpenAPI 3.0, Rate Limiting, Mutual TLS',
    group: 'integrations',
    description: 'Connects directly with official government platforms: DigiLocker, PAN (NSDL), e-Sign, Treasury Payments, State Bhulekh Land Records, and SMS/Email OTP.'
  },
  {
    id: 'department-matrix',
    label: 'Multi-Department Parallel Dispatch Engine',
    role: 'SLA Clock Control, Joint Inspection & Bottleneck Heatmaps',
    tech: 'Workflow State Machine (FSM), SLA Alert Daemon',
    group: 'gov_backend',
    description: 'Distributes verified applications in parallel to Pollution Control, Fire Services, Labour, Factories, and Electricity boards while enforcing Right to Public Services statutory deadlines.'
  }
];
