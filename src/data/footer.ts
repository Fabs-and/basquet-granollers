const currentYear = new Date().getFullYear();

export const topFooterLinks = [
  {
    title: `El club`,
    links: [
      { name: `Estatuts`, slug: 'estatuts' },
      { name: `Codi ètic`, slug: 'codi-etic' },
      {
        name: `Protocol prevenció violències sexuals`,
        slug: 'protocol-prevencio-violencies-sexuals',
      },
      {
        name: `Assegurança esportiva obligtòria`,
        slug: 'assegurança-esportiva-obligtoria',
      },
    ],
  },
  {
    title: `Equips`,
    links: [
      { name: `Escola de bàsquet`, slug: 'escola-de-basquet' },
      {
        name: `Bàsquet en cadira de rodes`,
        slug: 'basquet-en-cadira-de-rodes',
      },
      { name: `Masculins`, slug: 'masculins' },
      { name: `Femenins`, slug: `Femenins` },
    ],
  },
  {
    title: `Altres`,
    links: [
      { name: `Escola d'iniciació`, slug: 'escola-de-iniciacion' },
      { name: `Campus estiu 2023`, slug: 'campus-estiu-2023' },
      { name: `Tecnificació skills camp`, slug: 'tecnificacio-skills-camp' },
      {
        name: `FAQS: 10 preguntes i 10 respostes`,
        slug: 'faqs-10-preguntes-i-10-respostes',
      },
    ],
  },
];

export const topFooterImportantLinks = [
  { name: `Botiga`, slug: 'botiga' },
  {
    name: `La història del bàsquet a Granollers`,
    slug: 'la-historia-del-basquet-a-granollers',
  },
  { name: `Contacte`, slug: 'contacte' },
];

export const bottomFooterLinks = [
  { name: `Avís Legal`, slug: 'avis-legal' },
  { name: `Política de cookies`, slug: 'politica-de-cookies' },
];

export const copyright = `Web Propietat del Club Bàsquet Granollers. Copyright © ${currentYear}. All rights reserved`;

