const { faker } = require("@faker-js/faker");
const axios = require("axios");

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:4000/api/news",
});

const createArticle = async (article, token) => {
    try {
        const response = await apiClient.post("/", article, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

const getRandomTitle = () => {
    const titleGenerators = [
        faker.company.buzzPhrase({ min: 1, max: 3 }),
        faker.company.catchPhrase({ min: 1, max: 3 }),
        faker.food.description({ min: 1, max: 3 }),
        faker.food.dish({ min: 1, max: 3 }),
        faker.commerce.productDescription({ min: 1, max: 3 })
    ];

    const randomIndex = Math.floor(Math.random() * titleGenerators.length);
    return titleGenerators[randomIndex];
};

const descriptions = [
    "Crime and Its Impact on Society: Crime has been a long-standing issue in societies around the world, affecting individuals, families, and communities. The rise in organized crime, including cybercrime and white-collar offenses, has prompted governments to implement stricter laws and regulations. This essay explores the consequences of crime on both a micro and macro scale, focusing on law enforcement's role in combating it and the ways in which society can work together to prevent criminal activities.",
    "The Role of Media in Crime Reporting: The media plays a critical role in shaping public perceptions of crime. Sensationalized reporting often skews the reality of crime rates, leading to fear and distrust in communities. This essay examines the influence of media coverage on public opinion, how crime stories are selected and presented, and the ethical dilemmas involved in crime reporting.",
    "Cybercrime: The Growing Threat in the Digital Age: As technology advances, so does the sophistication of cybercriminals. From identity theft to ransomware attacks, cybercrime is a global issue that affects individuals and businesses alike. This essay delves into the rising concerns surrounding cybersecurity, the impact of cybercrime on economies, and the legal measures in place to protect against these threats.",
    "Human Rights Violations: A Global Crisis: Human rights violations continue to be a pressing concern in many parts of the world, often exacerbated by political instability and authoritarian regimes. This essay discusses various human rights issues, such as freedom of speech, the right to fair trials, and the protection of vulnerable populations. It also looks at the role of international organizations in advocating for human rights.",
    "The Impact of Immigration Laws on Families and Communities: Immigration laws have long been a contentious issue, particularly in countries with large immigrant populations. This essay examines the effects of restrictive immigration policies on families, including the emotional toll on individuals who are separated from loved ones, as well as the broader social implications for communities.",
    "Environmental Law: Protecting Our Planet for Future Generations: As environmental issues such as climate change and pollution continue to worsen, environmental law has become an essential tool in the fight to preserve our planet. This essay explores the significance of environmental regulations, the role of governments and corporations in implementing them, and the challenges involved in enforcing sustainable practices.",
    "The Ethics of Journalism in Reporting on Scandals: Investigative journalism plays a vital role in exposing corruption and scandals, but it often raises ethical questions about privacy, bias, and sensationalism. This essay addresses the balance between the public's right to know and the ethical responsibility of journalists to report accurately and fairly, especially in high-profile cases involving public figures.",
    "The Role of Law Enforcement in Social Justice Movements: Law enforcement agencies are often at the center of social justice movements, particularly when it comes to issues of racial equality and police reform. This essay examines the relationship between law enforcement and the communities they serve, exploring the need for systemic change to address issues of racial discrimination and the use of force by police officers.",
    "The Intersection of Tax Laws and Corporate Responsibility: Tax laws play a significant role in shaping corporate behavior, particularly when it comes to international taxation and the responsibilities of multinational corporations. This essay explores the ethical and legal considerations surrounding tax evasion and avoidance, and the role governments play in ensuring that corporations contribute fairly to public finances.",
    "Public Health and Legal Measures to Combat Epidemics: Public health crises, such as the COVID-19 pandemic, have highlighted the need for effective legal measures to manage the spread of infectious diseases. This essay discusses the balance between public health policies, individual freedoms, and the role of the law in enforcing measures such as quarantine and vaccination during pandemics."
];

const getRandomDescription = () => {
    const randomIndex = Math.floor(Math.random() * descriptions.length);
    return descriptions[randomIndex];
};

const thumbnails = [
    'uploads/crime.jpg',
    'uploads/astrology.jpg',
    'uploads/eclipse.jpg',
    'uploads/fireman.jpg',
    'uploads/sunset.jpg',
    'uploads/forestry.jpg',
    'uploads/feather.jpg',
    'uploads/aurora.jpg',
    'uploads/bones.jpg',
    'uploads/lake.jpg',
    'uploads/ghost.jpg',
    'uploads/hand.jpg',
    'uploads/confusion.jpg',
    'uploads/child.jpg',
    'uploads/2025.jpg',
    'uploads/pollution.jpg',
    'uploads/robot.jpg',
    'uploads/portrait.jpg',
    'uploads/fisherman.jpg',
    'uploads/law.jpg',
    'uploads/hungry.jpg',
    'uploads/elderly.jpg',
    'uploads/crying.jpg',
]


const getRandomThumbnail = () => {
    const randomIndex = Math.floor(Math.random() * thumbnails.length);
    return thumbnails[randomIndex];
};

const generateRandomArticleData = () => ({
    title: getRandomTitle(),
    description: getRandomDescription(),
    thumbnail: getRandomThumbnail(),
    releaseDate: faker.date.between({ from: '2000-01-01T00:00:00.000Z', to: '2024-01-01T00:00:00.000Z' }),
    tag_ids: [faker.number.int({ min: 1, max: 50 }), faker.number.int({ min: 219, max: 260 }), faker.number.int({ min: 442, max: 548 })]
});

const generateArticles = async (token, batch = 150) => {
    for (let i = 0; i < batch; i++) {
        const articleData = generateRandomArticleData();
        try {
            const article = await createArticle(articleData, token);
            console.log(`Article ${i + 1} created successfully:`, article);
        } catch (error) {
            console.error(`Failed to create game ${i + 1}:`, error.message);
        }
    }
};

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzQXQiOjE3Mzg4NjYzNzY1NzAsInVzZXJJZCI6MiwiaWF0IjoxNzM2MTg3OTc2fQ.dMmGR-UIBpgC_xfdILfAqWuLnd0ukCZjiaRWR_1Np10";
generateArticles(token);