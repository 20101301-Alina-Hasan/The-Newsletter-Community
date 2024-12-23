const { faker } = require("@faker-js/faker");
const axios = require("axios");

const apiClient = axios.create({
    baseURL: "http://127.0.0.1:3000/api/news",
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
]

const getRandomThumbnail = () => {
    const randomIndex = Math.floor(Math.random() * thumbnails.length);
    return thumbnails[randomIndex];
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

const generateRandomArticleData = (i) => ({
    title: `${getRandomTitle()}+${i}`,
    description: faker.lorem.sentences(10),
    thumbnail: getRandomThumbnail(),
    releaseDate: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }),
    tag_ids: [faker.number.int({ min: 51, max: 71 }), faker.number.int({ min: 1, max: 26 })]
});

const generateArticles = async (token, batch = 42074) => {
    for (let i = 0; i < batch; i++) {
        const articleData = generateRandomArticleData(i);
        try {
            const article = await createArticle(articleData, token);
            console.log(`Article ${i + 1} created successfully:`, article);
        } catch (error) {
            console.error(`Failed to create game ${i + 1}:`, error.message);
        }
    }
};

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzQXQiOjE3MzY1NzAyNzUzNzQsInVzZXJJZCI6MSwiaWF0IjoxNzMzODkxODc1fQ.YM7Q1PEV7U9-JFOyTWYGLmZmFyGVkqAwfLeW_G1f7eY";
generateArticles(token);