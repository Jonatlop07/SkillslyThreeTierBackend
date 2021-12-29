import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('test/bdd-functional/features/service-offer/query_user_service_offers.feature');

defineFeature(feature, (test) => {});
