/** ---------------------------------------------------------------------------------------------------------------------
 * @file site-content-configs.ts
 * @fileOverview one PageEditorConfig per site page plus the product-page one, transcribed from the
 *               reference dashboard's *_FIELDS lists and HOME_FIXED_GROUPS_CONFIG headings, minus the
 *               `heroBanner` image fields (no upload endpoint yet). Field keys match the stored
 *               content 1:1 — see the backend's siteContent.data.ts / productContent.data.ts.
 */
import { SitePage } from '@src/store/website/site-content.store';

import { BANNER_HINT, FieldDef, ItemGroupConfig, PageEditorConfig } from './admin-ui';

/** Every hero page shares one banner slot; the hint carries the exact pixel size the upload requires. */
const heroImage: FieldDef = {
  key: 'heroImage',
  label: 'Hero banner image',
  type: 'image',
  hint: BANNER_HINT,
};

const iconItem: Array<FieldDef> = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'subtitle', label: 'Subtitle', type: 'text' },
  { key: 'icon', label: 'Icon', type: 'icon' },
];

const iconDescription: Array<FieldDef> = [
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'icon', label: 'Icon', type: 'icon' },
];

const social: Array<FieldDef> = [
  { key: 'label', label: 'Label', type: 'text', required: true },
  { key: 'url', label: 'Link URL', type: 'text' },
  { key: 'icon', label: 'Icon', type: 'icon' },
];

const faq: Array<FieldDef> = [
  { key: 'question', label: 'Question', type: 'text', required: true },
  { key: 'answer', label: 'Answer', type: 'textarea' },
];

const faqGroup = (key: string, heading: string): ItemGroupConfig => ({
  key,
  heading,
  singular: 'FAQ',
  fields: faq,
  layout: 'table',
  columns: ['Question', 'Answer'],
  display: (i) => ({ title: i['question'], subtitle: i['answer'] }),
});

/** Same 8-char suffix scheme as the reference's newId(). */
const newId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 9)}`;

const HOME: PageEditorConfig = {
  fields: [
    { key: 'heroBadge', label: 'Hero badge text', type: 'text' },
    { key: 'heroHeading', label: 'Hero heading', type: 'text' },
    { key: 'heroSubheading', label: 'Hero subheading', type: 'textarea' },
    heroImage,
    { key: 'primaryCta', label: 'Primary button label', type: 'text' },
    { key: 'secondaryCta', label: 'Secondary button label', type: 'text' },
    { key: 'reviewScore', label: 'Review score (blank hides the rating)', type: 'text' },
    { key: 'reviewCount', label: 'Review count', type: 'text' },
    { key: 'bannerTitle', label: '"Not sure what you need" banner title', type: 'text' },
    { key: 'bannerSubtitle', label: 'Banner subtitle', type: 'text' },
    { key: 'bannerCta', label: 'Banner button label', type: 'text' },
    { key: 'ctaHeading', label: 'Bottom CTA heading', type: 'text' },
    { key: 'ctaSubheading', label: 'Bottom CTA subheading', type: 'text' },
    { key: 'ctaPrimaryLabel', label: 'Bottom CTA primary button', type: 'text' },
    { key: 'ctaSecondaryLabel', label: 'Bottom CTA secondary button', type: 'text' },
    { key: 'footerTagline', label: 'Footer tagline', type: 'textarea' },
  ],
  groups: [
    {
      key: 'features',
      heading: 'Feature strip (shown below hero)',
      singular: 'Feature',
      fields: iconItem,
      display: (i) => ({ title: i['title'], subtitle: i['subtitle'], icon: i['icon'] }),
    },
    {
      key: 'productCards',
      heading: 'Product cards',
      singular: 'Product card',
      fields: [
        { key: 'name', label: 'Product name', type: 'text', required: true },
        { key: 'tagline', label: 'Tagline', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'price', label: 'Starting price ($/mo)', type: 'number' },
        { key: 'ctaLabel', label: 'Button label', type: 'text' },
      ],
      display: (i) => ({
        title: i['name'],
        subtitle: `From $${Number(i['price'] ?? 0).toFixed(2)}/mo · ${i['tagline'] ?? ''}`,
      }),
    },
    {
      key: 'whyChoose',
      heading: 'Why businesses choose ZexServer',
      singular: 'Reason',
      fields: iconItem,
      display: (i) => ({ title: i['title'], subtitle: i['subtitle'], icon: i['icon'] }),
    },
    {
      key: 'testimonials',
      heading: 'Customer testimonials',
      singular: 'Testimonial',
      layout: 'table',
      columns: ['Quote', 'Name / role', 'Rating'],
      fields: [
        { key: 'quote', label: 'Quote', type: 'textarea', required: true },
        { key: 'name', label: 'Customer name', type: 'text', required: true },
        { key: 'role', label: 'Role / company', type: 'text' },
        { key: 'rating', label: 'Star rating', type: 'select', options: ['1', '2', '3', '4', '5'] },
      ],
      display: (i) => ({
        title: i['quote'],
        subtitle: `${i['name']} · ${i['role'] ?? ''}`,
        icon: '★'.repeat(Number(i['rating']) || 0),
      }),
      toDraft: (i) => ({ ...i, rating: String(i['rating'] ?? 5) }),
      fromDraft: (d, prev) => ({
        ...prev,
        ...d,
        _id: prev?.['_id'] ?? newId('ts'),
        rating: Number(d['rating']) || 5,
      }),
    },
  ],
};

const ABOUT: PageEditorConfig = {
  fields: [
    { key: 'heroHeading', label: 'Hero heading', type: 'text' },
    { key: 'heroSubheading', label: 'Hero subheading', type: 'textarea' },
    heroImage,
    { key: 'founded', label: 'Founded (year) — blank hides the stat', type: 'text' },
    { key: 'datacentersCount', label: 'Global datacenters', type: 'text' },
    { key: 'serversDeployed', label: 'Servers deployed', type: 'text' },
    { key: 'uptime', label: 'Network uptime', type: 'text' },
    { key: 'storyHeading', label: 'Story heading', type: 'text' },
    { key: 'storyParagraph1', label: 'Story paragraph 1', type: 'textarea' },
    { key: 'storyParagraph2', label: 'Story paragraph 2', type: 'textarea' },
    { key: 'ctaHeading', label: 'Bottom CTA heading', type: 'text' },
    { key: 'ctaSubheading', label: 'Bottom CTA subheading', type: 'text' },
    { key: 'footerTagline', label: 'Footer tagline', type: 'textarea' },
  ],
  groups: [
    {
      key: 'values',
      heading: 'What We Value',
      singular: 'Value',
      fields: iconDescription,
      display: (i) => ({ title: i['title'], subtitle: i['description'], icon: i['icon'] }),
    },
  ],
};

const CONTACT: PageEditorConfig = {
  fields: [
    { key: 'heroHeading', label: 'Hero heading', type: 'text' },
    { key: 'heroSubheading', label: 'Hero subheading', type: 'textarea' },
    heroImage,
    { key: 'businessName', label: 'Business name', type: 'text' },
    { key: 'businessWebsite', label: 'Business website', type: 'text' },
    { key: 'businessAddress', label: 'Business address', type: 'textarea' },
    { key: 'salesHours', label: 'Sales hours', type: 'text' },
    { key: 'faqTeaserHeading', label: 'FAQ teaser heading', type: 'text' },
    { key: 'faqTeaserSubheading', label: 'FAQ teaser subheading', type: 'text' },
  ],
  groups: [
    {
      key: 'channels',
      heading: 'Support channels',
      singular: 'Channel',
      fields: [
        { key: 'label', label: 'Title', type: 'text', required: true },
        { key: 'description', label: 'Description', type: 'text' },
        { key: 'value', label: 'Value / link text', type: 'text' },
        { key: 'icon', label: 'Icon', type: 'icon' },
      ],
      display: (i) => ({
        title: i['label'],
        subtitle: `${i['value'] ?? ''}\n${i['description'] ?? ''}`,
        icon: i['icon'],
      }),
    },
    {
      key: 'socialLinks',
      heading: 'Follow Us icons',
      singular: 'Social link',
      fields: social,
      display: (i) => ({ title: i['label'], subtitle: i['url'], icon: i['icon'] || undefined }),
    },
  ],
};

const SUPPORT: PageEditorConfig = {
  fields: [
    { key: 'heroHeading', label: 'Hero heading', type: 'text' },
    { key: 'heroSubheading', label: 'Hero subheading', type: 'textarea' },
    heroImage,
  ],
  groups: [
    {
      key: 'kbCategories',
      heading: 'Knowledge Base categories',
      singular: 'Category',
      fields: iconDescription,
      display: (i) => ({ title: i['title'], subtitle: i['description'], icon: i['icon'] }),
    },
    faqGroup('faqs', 'Frequently asked questions'),
  ],
};

const FOOTER: PageEditorConfig = {
  fields: [
    { key: 'tagline', label: 'Footer tagline', type: 'textarea' },
    { key: 'copyright', label: 'Copyright text', type: 'text' },
  ],
  groups: [
    {
      key: 'columns',
      heading: 'Footer link columns',
      singular: 'Column',
      fields: [
        { key: 'heading', label: 'Column heading', type: 'text', required: true },
        { key: 'links', label: 'Links (one per line: Label | URL)', type: 'textarea' },
      ],
      display: (i) => ({
        title: i['heading'],
        subtitle: (i['links'] ?? []).map((l: any) => l.label).join(', '),
      }),
      toDraft: (i) => ({
        ...i,
        links: (i['links'] ?? []).map((l: any) => `${l.label} | ${l.url}`).join('\n'),
      }),
      fromDraft: (d) => ({
        ...d,
        links: String(d['links'] ?? '')
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => {
            const [label, url] = s.split('|').map((x) => x.trim());
            return { label, url: url || '#' };
          }),
      }),
    },
    {
      key: 'social',
      heading: 'Footer social icons',
      singular: 'Social link',
      fields: social,
      display: (i) => ({ title: i['label'], subtitle: i['url'], icon: i['icon'] || undefined }),
    },
  ],
};

const LEGAL: PageEditorConfig = {
  fields: [
    { key: 'termsUpdated', label: 'Terms of Service — last updated', type: 'text' },
    { key: 'termsBody', label: 'Terms of Service', type: 'textarea' },
    { key: 'privacyUpdated', label: 'Privacy Policy — last updated', type: 'text' },
    { key: 'privacyBody', label: 'Privacy Policy', type: 'textarea' },
  ],
  groups: [],
};

export const SITE_CONFIGS: Record<SitePage, PageEditorConfig> = {
  home: HOME,
  about: ABOUT,
  contact: CONTACT,
  support: SUPPORT,
  footer: FOOTER,
  legal: LEGAL,
};

/** Product pages: icons here are emoji, typed as text (the reference's PC_*_FIELDS). */
const emojiItem: Array<FieldDef> = [
  { key: 'icon', label: 'Icon (emoji)', type: 'text' },
  { key: 'title', label: 'Title', type: 'text', required: true },
  { key: 'subtitle', label: 'Subtitle', type: 'text' },
];

const emojiLabel: Array<FieldDef> = [
  { key: 'icon', label: 'Icon (emoji)', type: 'text' },
  { key: 'label', label: 'Label', type: 'text', required: true },
];

export const PRODUCT_CONFIG: PageEditorConfig = {
  fields: [
    { key: 'heroBadge', label: 'Hero badge text', type: 'text' },
    { key: 'heroHeading1', label: 'Hero heading (line 1)', type: 'text' },
    { key: 'heroHeadingAccent', label: 'Hero heading (accent line)', type: 'text' },
    { key: 'heroSubheading', label: 'Hero subheading', type: 'textarea' },
    heroImage,
    { key: 'ctaHeading', label: 'CTA banner heading', type: 'text' },
    { key: 'ctaSubheading', label: 'CTA banner subheading', type: 'textarea' },
    { key: 'gridOneTitle', label: 'Feature grid 1 — title', type: 'text' },
    { key: 'gridOneSubtitle', label: 'Feature grid 1 — subtitle', type: 'text' },
    { key: 'gridTwoTitle', label: 'Feature grid 2 — title', type: 'text' },
    { key: 'gridTwoSubtitle', label: 'Feature grid 2 — subtitle', type: 'text' },
    {
      key: 'locationCities',
      label: 'Location cards (cities from the Locations table)',
      type: 'multiselect',
      options: [],
    },
  ],
  groups: [
    {
      key: 'featureStrip',
      heading: 'Feature strip',
      singular: 'Item',
      fields: emojiItem,
      display: (i) => ({ title: i['title'], subtitle: i['subtitle'], icon: i['icon'] }),
    },
    {
      key: 'whyChoose',
      heading: 'Why choose cards',
      singular: 'Card',
      fields: emojiItem,
      display: (i) => ({ title: i['title'], subtitle: i['subtitle'], icon: i['icon'] }),
    },
    faqGroup('faq', 'FAQ'),
    {
      key: 'gridOne',
      heading: 'Feature grid 1 items',
      singular: 'Item',
      fields: emojiLabel,
      display: (i) => ({ title: i['label'], subtitle: '', icon: i['icon'] }),
    },
    {
      key: 'gridTwo',
      heading: 'Feature grid 2 items',
      singular: 'Item',
      fields: emojiLabel,
      display: (i) => ({ title: i['label'], subtitle: '', icon: i['icon'] }),
    },
    {
      key: 'includedFeatures',
      heading: "Plan card — included features (listed after each plan's own specs)",
      singular: 'Feature',
      fields: [{ key: 'label', label: 'Label', type: 'text', required: true }],
      display: (i) => ({ title: i['label'], subtitle: '', icon: '' }),
    },
  ],
};
