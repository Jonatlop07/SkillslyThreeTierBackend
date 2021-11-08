import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';

const feature = loadFeature(
  'test/bdd-functional/features/posts/create_permanent_post.feature',
);

defineFeature(feature, (test) => {});
