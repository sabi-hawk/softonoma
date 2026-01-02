import { IndustryContentTemplate } from "./types";

export function getGenericIndustryTemplate(
  title: string
): IndustryContentTemplate {
  return {
    hero: {
      title: `${title} Technology Solutions`,
      description: `We provide specialized technology solutions tailored to the unique needs of the ${title.toLowerCase()} industry. Our expert team delivers innovative solutions that drive growth and success.`,
      primaryButtonText: "Get Started",
    },
    overview: {
      title: `About ${title} Industry`,
      paragraphs: [
        `The ${title.toLowerCase()} industry faces unique challenges and opportunities in today's digital landscape. Our team brings deep expertise and innovative solutions to help businesses in this sector thrive and grow.`,
        `We combine industry best practices with cutting-edge technology to deliver results that matter. Whether you need custom software, digital transformation, or specialized solutions, we're here to help your business succeed.`,
      ],
      image:
        "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/69521107000fadbdb2d0/view?project=694cc43b00225b94d30d",
    },
    stats: [
      {
        icon: "https://saigontechnology.com/wp-content/uploads/folder-check-1.svg",
        value: "50+",
        label: "Industry Projects",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/users.svg",
        value: "120+",
        label: "Successful Implementations",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/calendar.svg",
        value: "8+ Years",
        label: "Industry Experience",
      },
      {
        icon: "https://saigontechnology.com/wp-content/uploads/yellow_stars_in_flat_outline_and_glyph.svg",
        value: "95%",
        label: "Client Satisfaction Rate",
      },
    ],
    subServices: [
      {
        icon: "🚀",
        title: "Custom Solutions",
        description: `Specialized solutions designed specifically for the ${title.toLowerCase()} industry.`,
      },
      {
        icon: "🖥️",
        title: "Digital Transformation",
        description:
          "Modernize your operations with cutting-edge technology and digital solutions.",
      },
      {
        icon: "💬",
        title: "Industry Expertise",
        description:
          "Deep understanding of industry-specific challenges and opportunities.",
      },
    ],
    technologies: [
      {
        name: "Technology",
        icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695219bd0033f3c61edc/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Technology",
        icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6952199a00375ca93a4b/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Technology",
        icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695269be003360bed809/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Technology",
        icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695219a5003be273ee49/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Technology",
        icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695219900007059ac2cb/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Technology",
        icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/69526962002d4cdff6c9/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Technology",
        icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695798080010b92e9830/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Technology",
        icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695219b20015c62ac492/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Technology",
        icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/695219ab0019b9847999/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Technology",
        icon: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6952695c003e40a1102c/view?project=694cc43b00225b94d30d",
      },
    ],
    cards: [
      {
        quote: `Working with this team on our ${title.toLowerCase()} project was an excellent experience. They delivered exactly what we needed with professional communication throughout. The solution they built has significantly improved our operations and exceeded our expectations.`,
        author: "John Doe",
        role: "CEO",
        company: "Company Inc.",
      },
      {
        quote: `The services exceeded our expectations in every way. The team truly understood our business needs and delivered a solution that perfectly fits our workflow. Their technical expertise and attention to detail made this a successful partnership.`,
        author: "Jane Smith",
        role: "CTO",
        company: "Tech Corp",
      },
    ],
    partners: [
      {
        name: "Partner 1",
        logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba5d003008864d7b/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Partner 2",
        logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba62001457f024ef/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Partner 3",
        logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba6700016cac0e12/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Partner 4",
        logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba6b0032b310923f/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Partner 5",
        logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba7100113ef921e4/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Partner 6",
        logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba7c0012eee875af/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Partner 7",
        logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba760029ccc019e4/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Partner 8",
        logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba810038059a3274/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Partner 9",
        logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba900020801ed88d/view?project=694cc43b00225b94d30d",
      },
      {
        name: "Partner 10",
        logo: "https://cloud.appwrite.io/v1/storage/buckets/694cc45b003184dc8584/files/6954ba94003bdd021354/view?project=694cc43b00225b94d30d",
      },
    ],
  };
}
