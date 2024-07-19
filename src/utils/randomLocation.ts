const popularCities = [
  'New York, USA',
  'London, UK',
  'Paris, France',
  'Tokyo, Japan',
  'Sydney, Australia',
  'Rome, Italy',
  'Barcelona, Spain',
  'Amsterdam, Netherlands',
  'Dubai, UAE',
  'Singapore',
  'Hong Kong',
  'Berlin, Germany',
  'Rio de Janeiro, Brazil',
  'Cape Town, South Africa',
  'Bangkok, Thailand',
  'Istanbul, Turkey',
  'Vancouver, Canada',
  'San Francisco, USA',
  'Prague, Czech Republic',
  'Vienna, Austria',
];

export function getRandomLocation(): string {
  const randomIndex = Math.floor(Math.random() * popularCities.length);
  return popularCities[randomIndex];
}
