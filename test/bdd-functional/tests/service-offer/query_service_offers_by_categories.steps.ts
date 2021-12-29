import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('test/bdd-functional/features/service-offer/query_service_offers_by_categories.feature');

defineFeature(feature, (test) => {});
