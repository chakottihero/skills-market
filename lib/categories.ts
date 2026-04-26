export interface Subcategory {
  id: string;
  name_ja: string;
  name_en: string;
  name_zh: string;
}

export interface Category {
  id: string;
  name_ja: string;
  name_en: string;
  name_zh: string;
  icon: string;
  subcategories: Subcategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: "dev-tools",
    name_ja: "開発ツール",
    name_en: "Dev Tools",
    name_zh: "开发工具",
    icon: "🔧",
    subcategories: [
      { id: "code-review",    name_ja: "コードレビュー",      name_en: "Code Review",             name_zh: "代码审查" },
      { id: "test-automation",name_ja: "テスト自動化",         name_en: "Test Automation",         name_zh: "测试自动化" },
      { id: "debugging",      name_ja: "デバッグ",             name_en: "Debugging",               name_zh: "调试" },
      { id: "refactoring",    name_ja: "リファクタリング",     name_en: "Refactoring",             name_zh: "重构" },
      { id: "code-gen",       name_ja: "コード生成",           name_en: "Code Generation",         name_zh: "代码生成" },
      { id: "lint-format",    name_ja: "Lint・フォーマット",   name_en: "Lint & Format",           name_zh: "代码检查・格式化" },
      { id: "perf-opt",       name_ja: "パフォーマンス最適化", name_en: "Performance Optimization",name_zh: "性能优化" },
    ],
  },
  {
    id: "web-dev",
    name_ja: "Web開発",
    name_en: "Web Development",
    name_zh: "Web开发",
    icon: "🌐",
    subcategories: [
      { id: "frontend",   name_ja: "フロントエンド",  name_en: "Frontend",        name_zh: "前端" },
      { id: "backend",    name_ja: "バックエンド",    name_en: "Backend",         name_zh: "后端" },
      { id: "css-design", name_ja: "CSS・デザイン",   name_en: "CSS & Design",    name_zh: "CSS・设计" },
      { id: "api-dev",    name_ja: "API開発",         name_en: "API Development", name_zh: "API开发" },
      { id: "database",   name_ja: "データベース",    name_en: "Database",        name_zh: "数据库" },
      { id: "seo",        name_ja: "SEO",             name_en: "SEO",             name_zh: "搜索引擎优化" },
    ],
  },
  {
    id: "data-analytics",
    name_ja: "データ・分析",
    name_en: "Data & Analytics",
    name_zh: "数据・分析",
    icon: "📊",
    subcategories: [
      { id: "data-processing", name_ja: "データ処理",   name_en: "Data Processing",       name_zh: "数据处理" },
      { id: "visualization",   name_ja: "可視化",       name_en: "Visualization",         name_zh: "可视化" },
      { id: "statistics",      name_ja: "統計・計算",   name_en: "Statistics",            name_zh: "统计・计算" },
      { id: "scraping",        name_ja: "スクレイピング",name_en: "Web Scraping",          name_zh: "数据爬取" },
      { id: "etl",             name_ja: "ETL",          name_en: "ETL",                   name_zh: "数据清洗" },
    ],
  },
  {
    id: "devops",
    name_ja: "DevOps",
    name_en: "DevOps",
    name_zh: "运维自动化",
    icon: "⚙️",
    subcategories: [
      { id: "ci-cd",       name_ja: "CI/CD",             name_en: "CI/CD",           name_zh: "持续集成/部署" },
      { id: "docker",      name_ja: "Docker・コンテナ",   name_en: "Docker & Containers", name_zh: "Docker・容器" },
      { id: "deploy",      name_ja: "デプロイ",           name_en: "Deployment",      name_zh: "部署" },
      { id: "monitoring",  name_ja: "モニタリング",       name_en: "Monitoring",      name_zh: "监控" },
      { id: "infra",       name_ja: "インフラ",           name_en: "Infrastructure",  name_zh: "基础设施" },
      { id: "kubernetes",  name_ja: "Kubernetes",         name_en: "Kubernetes",      name_zh: "容器编排" },
    ],
  },
  {
    id: "ai-ml",
    name_ja: "AI・機械学習",
    name_en: "AI & Machine Learning",
    name_zh: "AI・机器学习",
    icon: "🤖",
    subcategories: [
      { id: "model-building",  name_ja: "モデル構築",       name_en: "Model Building",        name_zh: "模型构建" },
      { id: "prompt-opt",      name_ja: "プロンプト最適化", name_en: "Prompt Optimization",   name_zh: "提示词优化" },
      { id: "data-preprocess", name_ja: "データ前処理",     name_en: "Data Preprocessing",    name_zh: "数据预处理" },
      { id: "rag",             name_ja: "RAG",              name_en: "RAG",                   name_zh: "检索增强生成" },
      { id: "fine-tuning",     name_ja: "ファインチューニング", name_en: "Fine-tuning",        name_zh: "微调" },
      { id: "llm-tools",       name_ja: "LLMツール",        name_en: "LLM Tools",             name_zh: "大语言模型工具" },
      { id: "image-gen",       name_ja: "画像生成",         name_en: "Image Generation",      name_zh: "图像生成" },
      { id: "speech",          name_ja: "音声合成",         name_en: "Speech Synthesis",      name_zh: "语音合成" },
      { id: "agent-building",  name_ja: "エージェント構築", name_en: "Agent Building",        name_zh: "智能体构建" },
      { id: "mcp",             name_ja: "MCP連携",          name_en: "MCP Integration",       name_zh: "MCP集成" },
    ],
  },
  {
    id: "docs",
    name_ja: "ドキュメント",
    name_en: "Documentation",
    name_zh: "文档",
    icon: "📄",
    subcategories: [
      { id: "readme",      name_ja: "README生成",  name_en: "README Generation",       name_zh: "README生成" },
      { id: "api-docs",    name_ja: "API文書",     name_en: "API Documentation",       name_zh: "API文档" },
      { id: "tech-docs",   name_ja: "技術文書",    name_en: "Technical Documentation", name_zh: "技术文档" },
      { id: "comments",    name_ja: "コメント生成", name_en: "Comment Generation",     name_zh: "注释生成" },
      { id: "translation", name_ja: "翻訳",        name_en: "Translation",             name_zh: "翻译" },
      { id: "changelog",   name_ja: "チェンジログ", name_en: "Changelog",              name_zh: "变更日志" },
    ],
  },
  {
    id: "business",
    name_ja: "ビジネス・業務",
    name_en: "Business & Operations",
    name_zh: "商业・业务",
    icon: "💼",
    subcategories: [
      { id: "doc-creation",      name_ja: "資料作成",         name_en: "Document Creation",   name_zh: "文档创建" },
      { id: "email",             name_ja: "メール",           name_en: "Email",               name_zh: "邮件" },
      { id: "scheduling",        name_ja: "スケジュール",     name_en: "Scheduling",          name_zh: "日程管理" },
      { id: "accounting",        name_ja: "会計・経理",       name_en: "Accounting",          name_zh: "会计・财务" },
      { id: "marketing",         name_ja: "マーケティング",   name_en: "Marketing",           name_zh: "市场营销" },
      { id: "project-mgmt",      name_ja: "プロジェクト管理", name_en: "Project Management",  name_zh: "项目管理" },
      { id: "crm",               name_ja: "CRM",              name_en: "CRM",                 name_zh: "客户关系管理" },
      { id: "hr",                name_ja: "採用・HR",         name_en: "Recruitment & HR",    name_zh: "招聘・人力资源" },
      { id: "customer-support",  name_ja: "カスタマーサポート", name_en: "Customer Support",  name_zh: "客户支持" },
      { id: "sales-automation",  name_ja: "営業自動化",       name_en: "Sales Automation",    name_zh: "销售自动化" },
    ],
  },
  {
    id: "utility",
    name_ja: "ユーティリティ",
    name_en: "Utilities",
    name_zh: "工具集",
    icon: "🛠️",
    subcategories: [
      { id: "file-ops",    name_ja: "ファイル操作", name_en: "File Operations",  name_zh: "文件操作" },
      { id: "git-ops",     name_ja: "Git操作",     name_en: "Git Operations",   name_zh: "Git操作" },
      { id: "env-setup",   name_ja: "環境構築",    name_en: "Environment Setup",name_zh: "环境搭建" },
      { id: "cli",         name_ja: "CLI",         name_en: "CLI",              name_zh: "命令行工具" },
      { id: "conversion",  name_ja: "変換ツール",  name_en: "Conversion Tools", name_zh: "格式转换" },
      { id: "automation",  name_ja: "自動化",      name_en: "Automation",       name_zh: "自动化" },
    ],
  },
  {
    id: "security",
    name_ja: "セキュリティ",
    name_en: "Security",
    name_zh: "安全",
    icon: "🔒",
    subcategories: [
      { id: "vuln-check",   name_ja: "脆弱性チェック",      name_en: "Vulnerability Check",        name_zh: "漏洞检测" },
      { id: "auth",         name_ja: "認証・認可",           name_en: "Authentication & Authorization", name_zh: "认证・授权" },
      { id: "encryption",   name_ja: "暗号化",               name_en: "Encryption",                 name_zh: "加密" },
      { id: "audit",        name_ja: "監査・コンプライアンス", name_en: "Audit & Compliance",        name_zh: "审计・合规" },
      { id: "pentest",      name_ja: "ペネトレーションテスト", name_en: "Penetration Testing",       name_zh: "渗透测试" },
      { id: "siem",         name_ja: "SIEM",                  name_en: "SIEM",                       name_zh: "安全信息与事件管理" },
      { id: "zero-trust",   name_ja: "ゼロトラスト",          name_en: "Zero Trust",                 name_zh: "零信任" },
      { id: "incident",     name_ja: "インシデント対応",      name_en: "Incident Response",          name_zh: "事件响应" },
    ],
  },
  {
    id: "creative",
    name_ja: "クリエイティブ",
    name_en: "Creative",
    name_zh: "创意",
    icon: "🎨",
    subcategories: [
      { id: "design",     name_ja: "デザイン",       name_en: "Design",          name_zh: "设计" },
      { id: "music",      name_ja: "音楽",           name_en: "Music",           name_zh: "音乐" },
      { id: "video",      name_ja: "動画",           name_en: "Video",           name_zh: "视频" },
      { id: "3d",         name_ja: "3Dモデリング",   name_en: "3D Modeling",     name_zh: "3D建模" },
      { id: "writing",    name_ja: "ライティング",   name_en: "Writing",         name_zh: "写作" },
      { id: "uiux",       name_ja: "UI/UXデザイン",  name_en: "UI/UX Design",    name_zh: "UI/UX设计" },
      { id: "branding",   name_ja: "ブランディング", name_en: "Branding",        name_zh: "品牌设计" },
      { id: "slides",     name_ja: "プレゼン資料",   name_en: "Presentation",    name_zh: "演示文稿" },
      { id: "sns",        name_ja: "SNSコンテンツ",  name_en: "SNS Content",     name_zh: "社交媒体内容" },
    ],
  },
  {
    id: "education",
    name_ja: "学習・教育",
    name_en: "Learning & Education",
    name_zh: "学习・教育",
    icon: "📚",
    subcategories: [
      { id: "prog-learning",  name_ja: "プログラミング学習", name_en: "Programming Learning", name_zh: "编程学习" },
      { id: "math-calc",      name_ja: "数学・計算",         name_en: "Math & Calculation",   name_zh: "数学・计算" },
      { id: "quiz-gen",       name_ja: "問題生成",           name_en: "Problem Generation",   name_zh: "题目生成" },
      { id: "explanation",    name_ja: "解説",               name_en: "Explanation",          name_zh: "解说" },
      { id: "language",       name_ja: "語学",               name_en: "Language Studies",     name_zh: "语言学习" },
      { id: "exam-prep",      name_ja: "資格試験対策",       name_en: "Exam Preparation",     name_zh: "资格考试备考" },
      { id: "stem",           name_ja: "STEM教育",           name_en: "STEM Education",       name_zh: "STEM教育" },
      { id: "elearning",      name_ja: "eラーニング作成",    name_en: "E-learning Creation",  name_zh: "在线课程创建" },
    ],
  },
  {
    id: "mobile",
    name_ja: "モバイル",
    name_en: "Mobile",
    name_zh: "移动开发",
    icon: "📱",
    subcategories: [
      { id: "ios",              name_ja: "iOS",              name_en: "iOS",              name_zh: "iOS" },
      { id: "android",          name_ja: "Android",          name_en: "Android",          name_zh: "安卓" },
      { id: "react-native",     name_ja: "React Native",     name_en: "React Native",     name_zh: "React Native" },
      { id: "flutter",          name_ja: "Flutter",          name_en: "Flutter",          name_zh: "Flutter" },
      { id: "cross-platform",   name_ja: "クロスプラットフォーム", name_en: "Cross-platform", name_zh: "跨平台" },
    ],
  },
  {
    id: "lang-framework",
    name_ja: "言語・フレームワーク",
    name_en: "Languages & Frameworks",
    name_zh: "编程语言・框架",
    icon: "💻",
    subcategories: [
      { id: "python",  name_ja: "Python",               name_en: "Python",               name_zh: "Python" },
      { id: "js-ts",   name_ja: "JavaScript・TypeScript", name_en: "JavaScript・TypeScript", name_zh: "JavaScript・TypeScript" },
      { id: "rust",    name_ja: "Rust",                  name_en: "Rust",                  name_zh: "Rust" },
      { id: "go",      name_ja: "Go",                    name_en: "Go",                    name_zh: "Go" },
      { id: "java",    name_ja: "Java",                  name_en: "Java",                  name_zh: "Java" },
      { id: "ruby",    name_ja: "Ruby",                  name_en: "Ruby",                  name_zh: "Ruby" },
      { id: "swift",   name_ja: "Swift",                 name_en: "Swift",                 name_zh: "Swift" },
      { id: "cpp",     name_ja: "C/C++",                 name_en: "C/C++",                 name_zh: "C/C++" },
    ],
  },
  {
    id: "legal",
    name_ja: "法律・コンプライアンス",
    name_en: "Legal & Compliance",
    name_zh: "法律・合规",
    icon: "⚖️",
    subcategories: [
      { id: "contracts",   name_ja: "契約書・法文書",        name_en: "Contracts & Legal Documents",  name_zh: "合同・法律文件" },
      { id: "regulations", name_ja: "規制・コンプライアンス", name_en: "Regulations & Compliance",    name_zh: "法规・合规" },
      { id: "privacy",     name_ja: "プライバシー",          name_en: "Privacy",                     name_zh: "隐私" },
      { id: "ip",          name_ja: "知的財産",              name_en: "Intellectual Property",        name_zh: "知识产权" },
    ],
  },
  {
    id: "finance",
    name_ja: "金融・経済",
    name_en: "Finance & Economics",
    name_zh: "金融・经济",
    icon: "💰",
    subcategories: [
      { id: "stock",    name_ja: "株式・投資分析", name_en: "Stock & Investment Analysis", name_zh: "股票・投资分析" },
      { id: "crypto",   name_ja: "暗号通貨",       name_en: "Cryptocurrency",              name_zh: "加密货币" },
      { id: "risk",     name_ja: "リスク管理",     name_en: "Risk Management",             name_zh: "风险管理" },
      { id: "fin-acct", name_ja: "会計・財務",     name_en: "Accounting & Finance",        name_zh: "会计・财务" },
      { id: "trading",  name_ja: "トレーディング", name_en: "Trading",                     name_zh: "交易" },
    ],
  },
  {
    id: "medical",
    name_ja: "医療・ヘルスケア",
    name_en: "Healthcare",
    name_zh: "医疗・健康",
    icon: "🏥",
    subcategories: [
      { id: "diagnostics",   name_ja: "診断支援",          name_en: "Diagnostic Support",    name_zh: "诊断支持" },
      { id: "emr",           name_ja: "電子カルテ・HL7",   name_en: "EMR & HL7",             name_zh: "电子病历・HL7" },
      { id: "pharma",        name_ja: "医薬品・治療",      name_en: "Pharmaceuticals",       name_zh: "药品・治疗" },
      { id: "health-apps",   name_ja: "ヘルスケアアプリ",  name_en: "Healthcare Apps",       name_zh: "医疗应用" },
    ],
  },
  {
    id: "bio-science",
    name_ja: "化学・生命科学",
    name_en: "Chemistry & Life Sciences",
    name_zh: "化学・生命科学",
    icon: "🧬",
    subcategories: [
      { id: "bioinformatics", name_ja: "バイオインフォマティクス", name_en: "Bioinformatics",            name_zh: "生物信息学" },
      { id: "molecular",      name_ja: "タンパク質・分子設計",    name_en: "Protein & Molecular Design", name_zh: "蛋白质・分子设计" },
      { id: "chem-calc",      name_ja: "化学計算",                name_en: "Chemical Calculations",      name_zh: "化学计算" },
      { id: "cell-bio",       name_ja: "細胞・生物学",            name_en: "Cell Biology",               name_zh: "细胞・生物学" },
    ],
  },
  {
    id: "math-physics",
    name_ja: "数学・物理",
    name_en: "Mathematics & Physics",
    name_zh: "数学・物理",
    icon: "📐",
    subcategories: [
      { id: "numerical",    name_ja: "数値計算・シミュレーション", name_en: "Numerical Computation & Simulation", name_zh: "数值计算・仿真" },
      { id: "optimization", name_ja: "最適化",                    name_en: "Optimization",                      name_zh: "优化" },
      { id: "physics",      name_ja: "物理・工学",                name_en: "Physics & Engineering",              name_zh: "物理・工程" },
      { id: "linear-alg",   name_ja: "線形代数・行列",            name_en: "Linear Algebra & Matrices",          name_zh: "线性代数・矩阵" },
    ],
  },
  {
    id: "architecture",
    name_ja: "アーキテクチャ・設計",
    name_en: "Architecture & Design",
    name_zh: "架构・设计",
    icon: "🏗️",
    subcategories: [
      { id: "sys-design",    name_ja: "システム設計",           name_en: "System Design",        name_zh: "系统设计" },
      { id: "db-design",     name_ja: "DB設計",                 name_en: "Database Design",      name_zh: "数据库设计" },
      { id: "microservices", name_ja: "マイクロサービス",       name_en: "Microservices",        name_zh: "微服务" },
      { id: "api-design",    name_ja: "API設計",                name_en: "API Design",           name_zh: "API设计" },
      { id: "cloud-arch",    name_ja: "クラウドアーキテクチャ", name_en: "Cloud Architecture",   name_zh: "云架构" },
    ],
  },
  {
    id: "testing",
    name_ja: "テスト・QA",
    name_en: "Testing & QA",
    name_zh: "测试・质量保证",
    icon: "🧪",
    subcategories: [
      { id: "unit-test",  name_ja: "ユニットテスト", name_en: "Unit Testing",        name_zh: "单元测试" },
      { id: "e2e",        name_ja: "E2Eテスト",      name_en: "E2E Testing",         name_zh: "端到端测试" },
      { id: "load-test",  name_ja: "負荷テスト",     name_en: "Load Testing",        name_zh: "负载测试" },
      { id: "test-auto",  name_ja: "テスト自動化",   name_en: "Test Automation",     name_zh: "测试自动化" },
      { id: "qa-mgmt",    name_ja: "品質管理",       name_en: "Quality Management",  name_zh: "质量管理" },
    ],
  },
  {
    id: "research",
    name_ja: "研究・学術",
    name_en: "Research & Academia",
    name_zh: "学术研究",
    icon: "🎓",
    subcategories: [
      { id: "paper-writing", name_ja: "論文執筆",         name_en: "Paper Writing",                name_zh: "论文写作" },
      { id: "latex",         name_ja: "LaTeX",             name_en: "LaTeX",                        name_zh: "LaTeX" },
      { id: "lit-search",    name_ja: "文献検索",          name_en: "Literature Search",            name_zh: "文献检索" },
      { id: "exp-analysis",  name_ja: "実験データ解析",   name_en: "Experimental Data Analysis",   name_zh: "实验数据分析" },
      { id: "conference",    name_ja: "学会発表",          name_en: "Conference Presentation",      name_zh: "学术报告" },
    ],
  },
  {
    id: "real-estate",
    name_ja: "不動産・建設",
    name_en: "Real Estate & Construction",
    name_zh: "房地产・建筑",
    icon: "🏢",
    subcategories: [
      { id: "bim",          name_ja: "BIM",       name_en: "BIM",                       name_zh: "建筑信息模型" },
      { id: "floor-plan",   name_ja: "間取り設計", name_en: "Floor Plan Design",         name_zh: "户型设计" },
      { id: "re-analysis",  name_ja: "不動産分析", name_en: "Real Estate Analysis",      name_zh: "房地产分析" },
      { id: "construction", name_ja: "建設管理",   name_en: "Construction Management",   name_zh: "建设管理" },
    ],
  },
  {
    id: "agriculture",
    name_ja: "農業・環境",
    name_en: "Agriculture & Environment",
    name_zh: "农业・环境",
    icon: "🌾",
    subcategories: [
      { id: "precision-ag",  name_ja: "精密農業",         name_en: "Precision Agriculture",      name_zh: "精准农业" },
      { id: "weather",       name_ja: "気象データ",       name_en: "Weather Data",               name_zh: "气象数据" },
      { id: "env-monitor",   name_ja: "環境モニタリング", name_en: "Environmental Monitoring",   name_zh: "环境监测" },
      { id: "iot",           name_ja: "IoT連携",          name_en: "IoT Integration",            name_zh: "物联网集成" },
    ],
  },
  {
    id: "game-dev",
    name_ja: "ゲーム開発",
    name_en: "Game Development",
    name_zh: "游戏开发",
    icon: "🎮",
    subcategories: [
      { id: "unity",        name_ja: "Unity",           name_en: "Unity",         name_zh: "Unity" },
      { id: "unreal",       name_ja: "Unreal Engine",   name_en: "Unreal Engine", name_zh: "虚幻引擎" },
      { id: "game-ai",      name_ja: "ゲームAI",        name_en: "Game AI",       name_zh: "游戏AI" },
      { id: "level-design", name_ja: "レベルデザイン",  name_en: "Level Design",  name_zh: "关卡设计" },
      { id: "game-test",    name_ja: "ゲームテスト",    name_en: "Game Testing",  name_zh: "游戏测试" },
    ],
  },
  {
    id: "blockchain",
    name_ja: "ブロックチェーン・Web3",
    name_en: "Blockchain & Web3",
    name_zh: "区块链・Web3",
    icon: "🔗",
    subcategories: [
      { id: "smart-contract", name_ja: "スマートコントラクト", name_en: "Smart Contracts",  name_zh: "智能合约" },
      { id: "defi",           name_ja: "DeFi",                 name_en: "DeFi",             name_zh: "去中心化金融" },
      { id: "nft",            name_ja: "NFT",                  name_en: "NFT",              name_zh: "NFT" },
      { id: "dao",            name_ja: "DAO",                  name_en: "DAO",              name_zh: "去中心化自治组织" },
      { id: "wallet",         name_ja: "ウォレット連携",        name_en: "Wallet Integration", name_zh: "钱包集成" },
    ],
  },
  {
    id: "other",
    name_ja: "その他",
    name_en: "Other",
    name_zh: "其他",
    icon: "📦",
    subcategories: [],
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<string, Category>;

export function getCategoryName(id: string, locale: "ja" | "en" | "zh"): string {
  const cat = CATEGORY_MAP[id];
  if (!cat) return id;
  return locale === "en" ? cat.name_en : locale === "zh" ? cat.name_zh : cat.name_ja;
}

export function getSubcategoryName(catId: string, subId: string, locale: "ja" | "en" | "zh"): string {
  const cat = CATEGORY_MAP[catId];
  if (!cat) return subId;
  const sub = cat.subcategories.find((s) => s.id === subId);
  if (!sub) return subId;
  return locale === "en" ? sub.name_en : locale === "zh" ? sub.name_zh : sub.name_ja;
}
