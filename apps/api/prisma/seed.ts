import { faker } from '@faker-js/faker';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import * as argon2 from 'argon2';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const categoryData = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Technology, software, programming, and developer topics.',
  },
  {
    name: 'Programming',
    slug: 'programming',
    description: 'Programming languages, patterns, and software development.',
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Frontend, backend, full-stack, and web development.',
  },
  {
    name: 'Design',
    slug: 'design',
    description: 'UI, UX, visual design, and product design.',
  },
  {
    name: 'Career',
    slug: 'career',
    description: 'Career development, jobs, and professional growth.',
  },
  {
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'Practical guides and step-by-step tutorials.',
  },
];

async function main() {
  console.log('Starting seed...');

  // --------------------------------------------------
  // Clean existing data
  // --------------------------------------------------

  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // --------------------------------------------------
  // Password
  // --------------------------------------------------

  const password = await argon2.hash('Password123!');

  // --------------------------------------------------
  // Users
  // --------------------------------------------------

  const users = faker.helpers.multiple(
    () => ({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      bio: faker.lorem.paragraph(),
      avatar: faker.image.avatar(),
      password,
    }),
    {
      count: 10,
    },
  );

  await prisma.user.createMany({
    data: users,
  });

  const createdUsers = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  console.log(`Created ${createdUsers.length} users.`);

  // --------------------------------------------------
  // Categories
  // --------------------------------------------------

  await prisma.category.createMany({
    data: categoryData,
  });

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  console.log(`Created ${categories.length} categories.`);

  // --------------------------------------------------
  // Tags
  // --------------------------------------------------

  const tagNames = [
    'javascript',
    'typescript',
    'react',
    'nextjs',
    'nodejs',
    'nestjs',
    'graphql',
    'prisma',
    'postgresql',
    'tailwindcss',
    'web-development',
    'frontend',
    'backend',
    'database',
    'programming',
    'software-engineering',
    'career',
    'design',
  ];

  await prisma.tag.createMany({
    data: tagNames.map((name) => ({
      name,
    })),
  });

  const tags = await prisma.tag.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  console.log(`Created ${tags.length} tags.`);

  // --------------------------------------------------
  // Posts
  // --------------------------------------------------

  const posts = faker.helpers.multiple(
    () => {
      const title = faker.lorem.sentence({
        min: 5,
        max: 10,
      });

      const content = faker.lorem.paragraphs(6);

      const excerpt = faker.lorem.sentences(2);

      const category = faker.helpers.arrayElement(categories);

      const author = faker.helpers.arrayElement(createdUsers);

      const selectedTags = faker.helpers.arrayElements(tags, {
        min: 2,
        max: 5,
      });

      return {
        title,
        excerpt,
        content,
        thumbnail: faker.image.url(),
        slug: faker.helpers.slugify(title).toLowerCase(),
        authorId: author.id,
        categoryId: category.id,

        tagIds: selectedTags.map((tag) => tag.id),
      };
    },
    {
      count: 40,
    },
  );

  // --------------------------------------------------
  // Create posts + tags + comments
  // --------------------------------------------------

  for (const post of posts) {
    const createdPost = await prisma.post.create({
      data: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        thumbnail: post.thumbnail,
        slug: post.slug,
        authorId: post.authorId,
        categoryId: post.categoryId,

        tags: {
          connect: post.tagIds.map((id) => ({
            id,
          })),
        },

        comments: {
          create: faker.helpers.multiple(
            () => ({
              content: faker.lorem.paragraph({
                min: 2,
                max: 4,
              }),
              authorId: faker.helpers.arrayElement(createdUsers).id,
            }),
            {
              count: faker.number.int({
                min: 0,
                max: 5,
              }),
            },
          ),
        },
      },
    });

    console.log(`Created post: ${createdPost.title}`);
  }

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------

  const [userCount, categoryCount, tagCount, postCount, commentCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.post.count(),
      prisma.comment.count(),
    ]);

  console.log('');
  console.log('Seed completed successfully.');
  console.log('--------------------------------');
  console.log(`Users:      ${userCount}`);
  console.log(`Categories: ${categoryCount}`);
  console.log(`Tags:       ${tagCount}`);
  console.log(`Posts:      ${postCount}`);
  console.log(`Comments:   ${commentCount}`);
  console.log('--------------------------------');
}

main()
  .catch((error) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
