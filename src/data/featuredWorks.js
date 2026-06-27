// data/featuredWorks.js
export const FEATURED_WORKS = [
    { gallery: true, className: "work-card-vid gallery-tile" },
    {
  mesh: true,
  className: "work-card-vid mesh-card",
},
    {
        image: "/images/am-img-1.png",
        imageSrcSet:
            "/images/am-img-1.png 1x, /images/am-img-1@2x.png 2x, /images/am-img-1@3x.png 3x",
        href: "https://makersplace.com/",
        className: "work-card-img work-card-img-1",
    },
    {
        video: "/vids/p-1.mp4",
        isCaseStudy: true,
        brand: "MakersPlace",
        brandIcon: "/icons/MakersPlace.svg",
        project: "Design System 2.0",
        
        summary:
            "MakersPlace's legacy design system wasn't built to scale. Rebuilt from scratch with a modular foundation anchored by a flexible card system.",
        previewUrl: "",
        category: "Archive / Design System",
        className: "work-card-vid overview-img",
        caseTabs: {
            intro: [
                { type: "text", label: "Project", content: "Design System 2.0" },
                {
                    type: "text",
                    label: "Summary",
                    content:
                        "MakersPlace’s legacy design system wasn’t built to scale. It was rebuilt from scratch with a modular foundation anchored by a flexible card system, bringing faster design velocity, better consistency, and a premium experience aligned with the brand’s direction.",
                },
            ],
            team: [
                {
                    type: "text",
                    label: "Leadership",
                    content:
                        "Landon Langford, Andre Camara, Michael Skinner, Claus Enevoldsen",
                },
                { type: "text", label: "Sr. Product Manager", content: "Greg Harder" },
                {
                    type: "text",
                    label: "Lead Product Designer",
                    content: "Matt Silverman",
                },
                {
                    type: "text",
                    label: "Lead Front-End Engineer",
                    content: "Nikita Matusevich",
                },
                { type: "text", label: "Lead Back-End Engineer", content: "Chong Yao" },
                {
                    type: "text",
                    label: "Other Collaborators",
                    content:
                        "Stu Ohler, Liana Rogers, Aram Saloot, Nouman Saeed, Brian Shen, Sudhir Koneru, and many more.",
                },
            ],
            overview: [
                {
                    type: "text",
                    label: "Problem",
                    content:
                        "MakersPlace needed to strengthen its brand presence and align with a new business strategy. The legacy design system had hundreds of font styles and colors, duplicated components, and no sync between design and engineering libraries, making it impossible to maintain consistency or scale efficiently.",
                },
                {
                    type: "text",
                    label: "Goal",
                    content:
                        "The goal was to build a scalable design system that elevated the brand, improved design velocity, and brought consistency across all product surfaces.",
                },
                { type: "video", src: "/vids/o-1.mp4", caption: "Before" },
                { type: "video", src: "/vids/o-2.mp4", caption: "After" },
                {
                    type: "text",
                    label: "Solution",
                    content:
                        "I led the rebuild from scratch, working with product and engineering to streamline the system - cutting hundreds of font styles and colors down to a flexible foundation with clear standards both teams could rely on. I created and managed a component library that synced design and engineering for the first time.",
                },
                {
                    type: "text",
                    content:
                        "The new system was a modular card framework with hero and standard cards for each entity type (artist, artworks, exhibitions, editorial). The legacy homepage had stacked carousels with no visual distinction. The new system gave each entity a distinct identity, making pages scannable and intentional, while giving the business and marketing teams flexibility to spotlight priorities without needing design support every time.",
                },
                {
                    type: "text",
                    label: "Results",
                    content:
                        "The new system brought immediate impact. Faster design iteration, fewer developer questions during handoff, and a more premium, cohesive experience that aligned with the brand’s evolution. The modular foundation made it easier to scale and maintain as the product grew.",
                },
                {
                    type: "image",
                    src: "/images/cs-overview-1.png",
                    caption: "Primary Palette",
                },
                {
                    type: "image",
                    src: "/images/cs-overview-3.png",
                    caption: "High Contrast",
                },
                {
                    type: "image",
                    src: "/images/cs-overview-5.png",
                    caption: "Card System - Hero",
                },
                {
                    type: "image",
                    src: "/images/cs-overview-6.png",
                    caption: "Card System - Standard ",
                },
            ],
        },
    },
    {
        video: "/vids/p-2.mp4",
        isCaseStudy: true,
        brand: "MakersPlace",
        brandIcon: "/icons/MakersPlace.svg",
        project: "Design System 2.0",
        summary:
            "MakersPlace's legacy design system wasn't built to scale. Rebuilt from scratch with a modular foundation anchored by a flexible card system.",
        tools: [
            { name: "Figma", icon: "/preview-icon/Figma.svg" },
            { name: "Cursor", icon: "/preview-icon/Cursor.svg" },
        ],
        previewUrl: "",
        category: "Archive / PDP",
        className: "work-card-vid",
        caseTabs: {
            intro: [
                { type: "text", label: "Project", content: "Product Detail Page" },
                {
                    type: "text",
                    label: "Summary",
                    content:
                        "The Product Detail Page (PDP) was the only way to make a purchase on MakersPlace, and the old layout made that harder than it needed to be. Artwork sat in a small frame with no full-screen view, and key details like provenance and transaction history were pushed down the page, causing a lot of back-and-forth scrolling. The redesign introduces a larger, fixed artwork view with a scrolling right rail for key details, so collectors can stay focused on the piece and decide to purchase without fighting the page.",
                },
            ],
            team: [
                {
                    type: "text",
                    label: "Leadership",
                    content:
                        "Landon Langford, Bruno Orsini, Andre Camara, Michael Skinner, Claus Enevoldsen",
                },
                { type: "text", label: "Product Manager", content: "Aram Saloot" },
                {
                    type: "text",
                    label: "Lead Product Designer",
                    content: "Matt Silverman",
                },
                {
                    type: "text",
                    label: "Lead Front-End Engineer",
                    content: "Nikita Matusevich",
                },
                { type: "text", label: "Lead Back-End Engineer", content: "Chong Yao" },
                {
                    type: "text",
                    label: "Other Collaborators",
                    content:
                        "Stu Ohler, Liana Rogers, Aram Saloot, Nouman Saeed, Brian Shen, Sudhir Koneru, and many more.",
                },
            ],
            overview: [
                {
                    type: "text",
                    label: "Problem",
                    content:
                        "The legacy PDP had several UX and technical issues. Artwork was displayed too small and didn’t render at full quality, making it hard for collectors to inspect pieces before purchase. Key details like provenance, artist information, and other industry-standard signals were often hidden below the fold or missing from the right rail, which hurt trust and sales",
                },
                { type: "video", src: "/vids/cs-p-2-o-1.mp4", caption: "Before" },
                {
                    type: "text",
                    label: "Goal",
                    content:
                        "Create an immersive, intuitive PDP that allowed collectors to view artwork at full quality while seamlessly accessing details, meeting industry standards, and driving improvements in session time, conversion rate, and GMS.",
                },
                {
                    type: "image",
                    src: "/images/cs-p-2-overview-1.png",
                    caption: "After",
                },
                {
                    type: "text",
                    label: "Solution",
                    content:
                        "I led the redesign by first researching competitor PDPs and conducting user interviews with collectors to understand their purchase behavior. Testing wireframes and prototypes revealed a critical insight: collectors needed to view artwork and read details simultaneously without breaking focus.",
                },
                {
                    type: "text",
                    content:
                        "I designed a fixed artwork viewer paired with a scrolling right rail, allowing users to inspect artwork at full quality while details remained accessible alongside. This eliminated the constant back-and-forth scrolling that plagued the legacy experience. I also updated the design system with new components built specifically for the PDP.",
                },
                {
                    type: "image",
                    src: "/images/cs-p-2-overview-2.png",
                    caption: "Generative",
                },
                {
                    type: "image",
                    src: "/images/cs-p-2-overview-3.png",
                    caption: "Private Sales",
                },
                {
                    type: "text",
                    label: "Results",
                    content:
                        "The redesigned PDP improved usability and engagement, meeting all industry-standard features. The improvements contributed to increase in GMS, including a 400% increase in 2024 from the Private Sales program, alongside measurable gains in session time and conversion rate.",
                },
            ],
        },
    },
    {
        video: "/vids/p-3.mp4",
        isCaseStudy: true,
        brand: "MakersPlace",
        brandIcon: "/icons/MakersPlace.svg",
        project: "Design System 2.0",
        summary:
            "MakersPlace's legacy design system wasn't built to scale. Rebuilt from scratch with a modular foundation anchored by a flexible card system.",
        tools: [
            { name: "Figma", icon: "/preview-icon/Figma.svg" },
            { name: "Cursor", icon: "/preview-icon/Cursor.svg" },
        ],
        previewUrl: "",
        category: "Archive / Exhibition Page",
        className: "work-card-vid",
        caseTabs: {
            intro: [
                { type: "text", label: "Project", content: "Exhibition Page" },
                {
                    type: "text",
                    label: "Summary",
                    content:
                        "The Exhibition Page was redesigned and integrated into the MakersPlace site, creating a more immersive, storytelling-focused experience while improving the purchase flow for higher conversion and GMS.",
                },
            ],
            team: [
                {
                    type: "text",
                    label: "Leadership",
                    content:
                        "Landon Langford, Andre Camara, Michael Skinner, Claus Enevoldsen",
                },
                { type: "text", label: "Product Manager", content: "Aram Saloot" },
                {
                    type: "text",
                    label: "Lead Product Designer",
                    content: "Matt Silverman",
                },
                {
                    type: "text",
                    label: "Lead Front-End Engineer",
                    content: "Nikita Matusevich",
                },
                { type: "text", label: "Lead Back-End Engineer", content: "Chong Yao" },
                {
                    type: "text",
                    label: "Other Collaborators",
                    content:
                        "Stu Ohler, Liana Rogers, Aram Saloot, Nouman Saeed, Brian Shen, Sudhir Koneru, and many more.",
                },
            ],
            overview: [
                {
                    type: "text",
                    label: "Problem",
                    content:
                        "The original Exhibition Page was known as “Drops”, and was built in Webflow. It existed outside the MakersPlace site, creating a disjointed experience. It lacked a cohesive design, did not align with the new design system, and required multiple clicks to purchase, adding friction to the sales funnel.",
                },
                { type: "video", src: "/vids/cs-p-3-o-1.mp4", caption: "Before" },
                {
                    type: "text",
                    label: "Goal",
                    content:
                        "Bring the exhibition experience in-house, align it with the new design system, and create a seamless path from discovery to purchase while giving artists a platform to tell their story.",
                },
                { type: "video", src: "/vids/cs-p-3-o-2.mp4", caption: "After" },
                {
                    type: "text",
                    label: "Solution",
                    content:
                        "I led cross-functional working sessions with product, marketing, business, and engineering to redesign the Exhibition Page within the MakersPlace platform using the updated design system and card framework.",
                },
                {
                    type: "text",
                    content:
                        "The new experience prioritized storytelling by allowing artists to add 3–5 minute videos explaining their process, tools, and creative intent. A modular layout and a newly designed mini PDP (product detail page) embedded directly on the exhibition page enabled users to view artwork details and purchase without leaving the page, reducing friction in the sales funnel.",
                },
                {
                    type: "text",
                    label: "Results",
                    content:
                        "The Exhibition Page was redesigned and built within the MakersPlace platform using the new design system, with newly introduced provenance, auction mechanics, and a richer storytelling experience. The improved purchase flow led to increased sales conversions and higher GMS, while the storytelling elements enhanced artist-collector engagement. Session rate increased 1400%, average session length grew by 5 minutes, conversion rate rose 350%, and the page drove over $840,000 in GMS directly.",
                },
            ],
        },
    },
    {
        video: "/vids/p-4.mp4",
        isCaseStudy: true,
        brand: "MakersPlace",
        brandIcon: "/icons/MakersPlace.svg",
        project: "Design System 2.0",
        summary:
            "MakersPlace's legacy design system wasn't built to scale. Rebuilt from scratch with a modular foundation anchored by a flexible card system.",
        tools: [
            { name: "Figma", icon: "/preview-icon/Figma.svg" },
            { name: "Cursor", icon: "/preview-icon/Cursor.svg" },
        ],
        previewUrl: "",
        category: "Archive / Profile Page",
        className: "work-card-vid",
        caseTabs: {
            intro: [
                { type: "text", label: "Project", content: "Profile Page" },
                {
                    type: "text",
                    label: "Summary",
                    content:
                        "The updated modular design improved how user activity is organized and presented, making profiles more informative and cohesive. The card system helped create a seamless, engaging layout that helps users quickly understand an artist, collector, or curator and their activity.",
                },
            ],
            team: [
                {
                    type: "text",
                    label: "Leadership",
                    content:
                        "Bruno Orsini, Andre Camara, Michael Skinner, Claus Enevoldsen",
                },
                { type: "text", label: "Sr. Product Manager", content: "Greg Harder" },
                {
                    type: "text",
                    label: "Lead Product Designer",
                    content: "Matt Silverman",
                },
                {
                    type: "text",
                    label: "Lead Front-End Engineer",
                    content: "Nikita Matusevich",
                },
                { type: "text", label: "Lead Back-End Engineer", content: "Chong Yao" },
                {
                    type: "text",
                    label: "Other Collaborators",
                    content:
                        "Liana Rogers, Nouman Saeed, Brian Shen, Jared Waniger, Parin Heidari, and many more.",
                },
            ],
            overview: [
                {
                    type: "text",
                    label: "Problem",
                    content:
                        "The previous profile page lacked structure and clarity, making it difficult to showcase an artist, collector, or curator’s activity in a meaningful way. It needed a redesign using the modular card system to create a more organized, scalable, and visually cohesive experience that effectively highlighted user activity and interactions.",
                },
                {
                    type: "image",
                    src: "/images/cs-p-4-overview-1.png",
                    caption: "Before",
                },
                {
                    type: "text",
                    label: "Goal",
                    content:
                        "Design and build a new profile page pattern using the modular card system, creating a clear, repeatable structure for how artist, collector, and curator activity is organized and presented.",
                },
                {
                    type: "text",
                    label: "Solution",
                    content:
                        "The redesigned Profile Page introduced a structured layout with an Artwork Hero card at the top, followed by modular sections that organized user activity across five shared entities: artists, artworks, series, exhibitions, and editorials. Each profile type—artist, collector, and curator—featured the same structured sections but displayed relevant content based on their activity. The modular card system ensured consistency, scalability, and a cohesive browsing experience.",
                },
                { type: "video", src: "/vids/cs-p-4-o-2.mp4", caption: "After" },
                {
                    type: "text",
                    label: "Results",
                    content:
                        "The modular design improved the organization and presentation of user activity, making profiles more informative and visually cohesive. By leveraging the card system, the new layout provided a seamless and engaging experience, allowing users to explore an artist, collector, or curator’s impact at a glance.",
                },
            ],
        },
    },
    {
        image: "/images/a-img-1.png",
        imageSrcSet:
            "/images/a-img-1.png 1x, /images/a-img-1@2x.png 2x, /images/a-img-1@3x.png 3x",
        href: "https://olympusdao.finance/",
        className: "work-card-img",
    },
    {
        image: "/images/a-img-2.png",
        imageSrcSet:
            "/images/a-img-2.png 1x, /images/a-img-2@2x.png 2x, /images/a-img-2@3x.png 3x",
        href: "https://olympusdao.finance/",
        className: "work-card-img",
    },
    {
        image: "/images/a-img-3.png",
        imageSrcSet:
            "/images/a-img-3.png 1x, /images/a-img-3@2x.png 2x, /images/a-img-3@3x.png 3x",
        href: "https://olympusdao.finance/",
        className: "work-card-img",
    },
    {
        image: "/images/a-img-4.png",
        imageSrcSet:
            "/images/a-img-4.png 1x, /images/a-img-4@2x.png 2x, /images/a-img-4@3x.png 3x",
        href: "https://olympusdao.finance/",
        className: "work-card-img",
    },
    {
        image: "/images/a-img-5.png",
        imageSrcSet:
            "/images/a-img-5.png 1x, /images/a-img-5@2x.png 2x, /images/a-img-5@3x.png 3x",
        href: "https://olympusdao.finance/",
        className: "work-card-img",
    },
    {
        image: "/images/a-img-6.png",
        imageSrcSet:
            "/images/a-img-6.png 1x, /images/a-img-6@2x.png 2x, /images/a-img-6@3x.png 3x",
        href: "https://www.actionnetwork.com/",
        className: "work-card-img work-card-img-6",
    },
    {
        image: "/images/a-img-7.png",
        imageSrcSet:
            "/images/a-img-7.png 1x, /images/a-img-7@2x.png 2x, /images/a-img-7@3x.png 3x",
        href: "https://www.actionnetwork.com/",
        className: "work-card-img work-card-img-7",
    },
    {
        image: "/images/a-img-8.png",
        imageSrcSet:
            "/images/a-img-8.png 1x, /images/a-img-8@2x.png 2x, /images/a-img-8@3x.png 3x",
        href: "https://www.actionnetwork.com/",
        className: "work-card-img work-card-img-7",
    },
];

export default FEATURED_WORKS;
