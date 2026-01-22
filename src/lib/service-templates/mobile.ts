import { ServiceContentTemplate } from "./types";

export function getMobileTemplate(title: string): ServiceContentTemplate {
  return {
    hero: {
      title: `${title} Services for Modern Businesses`,
      description:
        "Build powerful, user-friendly mobile applications that engage users and drive business growth. We develop native and cross-platform mobile apps for iOS and Android using cutting-edge technologies.",
      primaryButtonText: "Get a Free Consultation",
    },
    overview: {
      title: "Comprehensive Mobile App Development Services",
      paragraphs: [
        "We create mobile applications that deliver exceptional user experiences across iOS and Android platforms. Our team specializes in native development, cross-platform solutions, and progressive web apps that perform flawlessly on all devices.",
        "From concept to launch, we handle every aspect of mobile app development including UI/UX design, development, testing, deployment, and ongoing maintenance. We build apps that are fast, secure, and scalable to support your growing user base.",
      ],
      image: "",
    },
    stats: [
      { icon: "https://saigontechnology.com/wp-content/uploads/users.svg", value: "35+", label: "Mobile Developers" },
      { icon: "https://saigontechnology.com/wp-content/uploads/folder-check-1.svg", value: "100+", label: "Mobile Apps Delivered" },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/calendar.svg",
        value: "8+ Years",
        label: "Mobile Development Experience",
      },
      { icon: "https://saigontechnology.com/wp-content/uploads/yellow_stars_in_flat_outline_and_glyph.svg", value: "4.8", label: "App Store Rating" },
    ],
    subServices: [
      {
        icon: "🍎",
        title: "iOS App Development",
        description:
          "Native iOS applications built with Swift and SwiftUI for optimal performance and user experience.",
      },
      {
        icon: "🤖",
        title: "Android App Development",
        description:
          "Native Android apps using Kotlin and Jetpack Compose for modern, efficient applications.",
      },
      {
        icon: "📱",
        title: "React Native Development",
        description:
          "Cross-platform mobile apps with React Native for faster development and code sharing.",
      },
      {
        icon: "🐦",
        title: "Flutter Development",
        description:
          "Beautiful, natively compiled apps for mobile, web, and desktop with Flutter.",
      },
      {
        icon: "🌐",
        title: "Progressive Web Apps (PWA)",
        description:
          "Web apps that work like native apps with offline capabilities and push notifications.",
      },
      {
        icon: "🔄",
        title: "App Maintenance & Updates",
        description:
          "Ongoing support, bug fixes, feature updates, and performance optimization for your apps.",
      },
    ],
    whyChooseUs: {
      subtitle:
        "We build mobile apps that users love and businesses rely on.",
      items: [
        "Expert knowledge of iOS and Android platforms",
        "Cross-platform development expertise",
        "Focus on performance and user experience",
        "App Store optimization and deployment",
        "Comprehensive testing across devices",
        "Ongoing support and maintenance",
      ],
      image: "",
    },
    technologies: [
      { name: "Swift", icon: "🍎" },
      { name: "Kotlin", icon: "🤖" },
      { name: "React Native", icon: "⚛️" },
      { name: "Flutter", icon: "🐦" },
      { name: "iOS", icon: "📱" },
      { name: "Android", icon: "🤖" },
      { name: "Firebase", icon: "🔥" },
      { name: "Xamarin", icon: "💜" },
    ],
    process: [
      {
        number: "1",
        title: "Discovery & Strategy",
        description:
          "Understand your business goals, target audience, and app requirements to create a strategic roadmap.",
      },
      {
        number: "2",
        title: "UI/UX Design",
        description:
          "Create intuitive, user-friendly designs that provide exceptional user experiences.",
      },
      {
        number: "3",
        title: "Platform Selection",
        description:
          "Choose between native, cross-platform, or PWA based on your needs and budget.",
      },
      {
        number: "4",
        title: "Development",
        description:
          "Build your app using best practices, clean code, and modern development frameworks.",
      },
      {
        number: "5",
        title: "Testing & QA",
        description:
          "Comprehensive testing across devices, operating systems, and use cases.",
      },
      {
        number: "6",
        title: "App Store Submission",
        description:
          "Prepare and submit your app to Apple App Store and Google Play Store.",
      },
      {
        number: "7",
        title: "Launch & Support",
        description:
          "Launch your app and provide ongoing maintenance, updates, and support.",
      },
    ],
    testimonials: [
      {
        quote:
          "They developed our iOS and Android apps with React Native, and the results are outstanding. The apps are fast, responsive, and beautifully designed. Their expertise in mobile development and attention to detail made the entire process smooth. The apps have received excellent user reviews and ratings.",
        author: "Michael Chen",
        role: "Product Manager",
        company: "MobileFirst Solutions",
      },
      {
        quote:
          "Our mobile app project exceeded expectations. They built a native iOS app that our users love. The app is intuitive, performs flawlessly, and has significantly increased user engagement. Their team was professional, responsive, and delivered on time. Highly recommended!",
        author: "Emily Rodriguez",
        role: "CEO",
        company: "AppInnovate Inc.",
      },
      {
        quote:
          "Working with them on our Flutter app was a great experience. They created a cross-platform app that works perfectly on both iOS and Android. The development process was transparent, and they kept us informed at every stage. The app has been a huge success with our customers.",
        author: "David Kim",
        role: "CTO",
        company: "TechMobile Solutions",
      },
      {
        quote:
          "They transformed our mobile app idea into reality. The React Native app they built is fast, user-friendly, and has all the features we needed. Their expertise in mobile development and their ability to understand our business needs made this a successful partnership. Great work!",
        author: "Sarah Johnson",
        role: "Founder",
        company: "StartupMobile",
      },
      {
        quote:
          "The mobile app they developed for us has been a game-changer. It's well-designed, performs excellently, and has improved our customer engagement significantly. Their post-launch support has been exceptional, and they're always quick to address any issues. Excellent mobile development team!",
        author: "James Wilson",
        role: "VP of Product",
        company: "DigitalMobile Corp",
      },
    ],
    faq: [
      {
        question: "Should I build a native or cross-platform app?",
        answer:
          "Native apps offer the best performance and platform-specific features, while cross-platform apps (React Native, Flutter) allow faster development and code sharing. We'll analyze your requirements, budget, and timeline to recommend the best approach for your project.",
      },
      {
        question: "How long does mobile app development take?",
        answer:
          "Development time varies based on complexity and features. Simple apps may take 2-3 months, while complex applications can take 6-12 months. We provide detailed timelines after understanding your requirements during the initial consultation.",
      },
      {
        question: "Do you handle App Store submissions?",
        answer:
          "Yes, we handle the entire App Store submission process for both Apple App Store and Google Play Store. This includes preparing assets, writing descriptions, handling reviews, and managing the submission process to ensure your app gets approved.",
      },
      {
        question: "Can you update existing mobile apps?",
        answer:
          "Absolutely! We can update, maintain, and enhance existing mobile apps. We work with apps built in any technology and can add new features, fix bugs, improve performance, and ensure compatibility with the latest OS versions.",
      },
      {
        question: "How do you ensure app security?",
        answer:
          "We implement comprehensive security measures including secure authentication, data encryption, secure API communication, secure storage, and follow OWASP mobile security best practices. We conduct security audits and penetration testing to ensure your app is secure.",
      },
      {
        question: "Do you provide app maintenance services?",
        answer:
          "Yes, we offer ongoing maintenance services including bug fixes, feature updates, OS compatibility updates, performance optimization, security patches, and 24/7 monitoring. We provide flexible maintenance packages tailored to your needs.",
      },
    ],
    cta: {
      title: "Ready to Build Your Mobile App?",
      description:
        "Let's create a mobile application that engages users and drives business growth. Contact us today.",
      buttonText: "Start Your Mobile Project",
    },
    partners: [
      { name: "Partner 1", logo: "" },
      { name: "Partner 2", logo: "" },
      { name: "Partner 3", logo: "" },
      { name: "Partner 4", logo: "" },
      { name: "Partner 5", logo: "" },
      { name: "Partner 6", logo: "" },
      { name: "Partner 7", logo: "" },
      { name: "Partner 8", logo: "" },
      { name: "Partner 9", logo: "" },
      { name: "Partner 10", logo: "" },
    ],
  };
}

