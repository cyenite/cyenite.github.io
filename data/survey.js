/**
 * Survey control data.
 *
 * Every project is a control station on one continuous plane. Position is
 * derived, never authored: `x` from the date, `y` from the band, plus a
 * seeded offset so the plot reads as a survey rather than a spreadsheet.
 *
 * `order` mirrors real triangulation orders and drives label priority, which
 * is how a map decides what to name at a given scale. `kind` drives glyph
 * geometry so the plot stays readable in greyscale.
 */

export const EPOCH = 2018.5;
export const HORIZON = 2026.7;

export const BANDS = {
    tooling: -880,
    mobile: -430,
    web: 40,
    quant: 500,
    spatial: 940,
};

export const KINDS = {
    app: { glyph: 'circle', label: 'Mobile application' },
    package: { glyph: 'cross', label: 'Published library' },
    platform: { glyph: 'square', label: 'Web platform' },
    extension: { glyph: 'diamond', label: 'Editor extension' },
    research: { glyph: 'benchmark', label: 'Applied research' },
    instrument: { glyph: 'triangle', label: 'Market instrument' },
};

export const SHEETS = [
    {
        id: 'control',
        code: '01',
        name: 'Control',
        note: 'Primary station and observer',
        view: { x: 0, y: 0, zoom: 1 },
        bounds: { x: -330, y: -300, w: 660, h: 600 },
    },
    {
        id: 'survey',
        code: '02',
        name: 'Activities',
        note: 'Everything built, 2018 to 2026',
        view: { x: 2740, y: 10, zoom: 0.28 },
        bounds: { x: 1060, y: -1240, w: 3360, h: 2500 },
    },
    {
        id: 'section',
        code: '03',
        name: 'Section',
        note: 'Where the training came from',
        view: { x: 0, y: 2050, zoom: 1 },
        bounds: { x: -330, y: 1700, w: 660, h: 660 },
    },
    {
        id: 'legend',
        code: '04',
        name: 'Legend',
        note: 'Key, tools, and how to reach me',
        view: { x: -1950, y: 0, zoom: 1 },
        bounds: { x: -2330, y: -350, w: 660, h: 700 },
    },
];

export const OBSERVER = {
    name: 'Aaron Rono',
    handle: 'cyenite',
    role: 'Software Engineer',
    post: 'Mobile Software Engineer, Solutech Limited',
    postLink: 'https://solutech.co.ke',
    datum: 'Nairobi, Kenya',
    coordinate: { lat: -1.286389, lon: 36.817223 },
    summary:
        'Trained as a surveyor, working as a software engineer. I read Geomatics and Geospatial Information Systems, then spent eight years shipping mobile applications, web platforms, and instruments for measuring markets.',
    lines: [
        'Mobile engineering at Solutech Limited, principally Flutter and Dart.',
        'Quantitative work: distribution models, market-cycle mapping, trade analytics.',
        'Geospatial and remote-sensing tooling carried over from the degree.',
        'Away from a keyboard: guitar, audiobooks, and an unreasonable number of hours in games.',
    ],
};

export const CONTACT = {
    email: 'aaronokip@gmail.com',
    github: 'https://github.com/cyenite',
    linkedin: 'https://www.linkedin.com/in/aaronkip/',
    resume: './files/cyenite-resume.pdf',
};

export const PROFILE = [
    {
        id: 'solutech',
        kind: 'post',
        name: 'Solutech Limited',
        detail: 'Mobile Software Engineer',
        note: 'Flutter and Dart in production, field-facing logistics and distribution software.',
        from: 2025.17,
        to: HORIZON,
    },
    {
        id: 'fleetsimplify',
        kind: 'post',
        name: 'Fleetsimplify',
        detail: 'Mobile Developer',
        note: 'Flutter and Dart across fleet and driver operations.',
        from: 2022.92,
        to: 2025.17,
    },
    {
        id: 'dekut',
        kind: 'study',
        name: 'Dedan Kimathi University of Technology',
        detail: 'BSc Geomatics and Geospatial Information Systems',
        note: 'Surveying, geodesy, photogrammetry, remote sensing, spatial databases.',
        from: 2018.6,
        to: 2022.5,
    },
    {
        id: 'microsoft',
        kind: 'cert',
        name: 'Microsoft Learn',
        detail: 'Mobile and web development',
        note: 'C# and C++.',
        from: 2018.7,
        to: 2019.6,
    },
    {
        id: 'andela',
        kind: 'cert',
        name: 'Andela Learning Community',
        detail: 'Android development',
        note: 'Java and Kotlin. Where the first shipped application came from.',
        from: 2018.1,
        to: 2018.9,
    },
    {
        id: 'kabianga',
        kind: 'study',
        name: 'Kabianga High School',
        detail: 'Mathematics, sciences, geography',
        note: 'Technical drawing and design.',
        from: 2014.1,
        to: 2017.9,
    },
];

export const PROJECTS = [
    {
        id: 'quantcode-newsdesk',
        kind: 'platform',
        band: 'quant',
        name: 'Quantcode Newsdesk',
        date: 'Aug 2026',
        year: 2026.58,
        order: 1,
        link: 'https://quantcode.net/newsdesk',
        stack: ['TypeScript', 'React'],
        blurb: 'Market news desk for the Quantcode platform.',
    },
    {
        id: 'quantcode-options',
        kind: 'platform',
        band: 'quant',
        name: 'Quantcode Options',
        date: 'Jun 2026',
        year: 2026.42,
        order: 1,
        link: 'https://options.quantcode.net',
        stack: ['TypeScript', 'React'],
        blurb: 'Options analytics for the Quantcode platform.',
    },
    {
        id: 'saccofy',
        kind: 'app',
        band: 'mobile',
        name: 'Saccofy',
        date: 'Mar 2026',
        year: 2026.17,
        order: 1,
        link: 'https://github.com/cyenite/saccofy',
        stack: ['Dart', 'Flutter', 'Firebase'],
        blurb: 'Runs SACCO co-operative operations end to end: member accounts, share capital, loan books, and transaction reconciliation.',
    },
    {
        id: 'quantcode',
        kind: 'platform',
        band: 'quant',
        name: 'Quantcode',
        date: 'Mar 2026',
        year: 2026.17,
        order: 1,
        link: 'https://github.com/cyenite/quantcode',
        stack: ['TypeScript', 'React'],
        blurb: 'Quantitative trading platform: visual strategy builder, backtesting engine, trade journal, alerting, and a marketplace for published strategies.',
    },
    {
        id: 'chemichemi',
        kind: 'app',
        band: 'mobile',
        name: 'Chemichemi',
        date: 'Mar 2026',
        year: 2026.17,
        order: 2,
        link: 'https://github.com/cyenite/chemichemi',
        stack: ['Dart', 'Flutter', 'Firebase'],
        blurb: 'Bible reader with multiple translations, bookmarks, highlights, notes, daily verse notifications, and complete offline support.',
    },
    {
        id: 'noryxon',
        kind: 'platform',
        band: 'web',
        name: 'Noryxon',
        date: 'Mar 2026',
        year: 2026.17,
        order: 1,
        link: 'https://github.com/cyenite/noryxon',
        stack: ['Laravel', 'Vue', 'PHP', 'JavaScript'],
        blurb: 'Crypto payment gateway with wallet management, live payment monitoring, invoicing, webhooks, and a developer portal issuing API keys.',
    },
    {
        id: 'fable',
        kind: 'extension',
        band: 'tooling',
        name: 'Fable',
        date: 'Jan 2026',
        year: 2026.0,
        order: 1,
        link: 'https://github.com/cyenite/fable-flutter',
        stack: ['TypeScript', 'VS Code API'],
        blurb: 'Turns a Flutter codebase into living documentation. Discovers feature modules, parses BDD Gherkin, and drafts README and feature docs from the source.',
    },
    {
        id: 'tonely',
        kind: 'platform',
        band: 'web',
        name: 'Tonely',
        date: 'Nov 2025',
        year: 2025.83,
        order: 2,
        link: 'https://github.com/cyenite/Tonely',
        stack: ['TypeScript', 'React'],
        blurb: 'Interactive music-theory trainer: intervals, scales, and instrument practice built as graded exercises.',
    },
    {
        id: 'tradescribe',
        kind: 'platform',
        band: 'quant',
        name: 'TradeScribe',
        date: 'Dec 2024',
        year: 2024.92,
        order: 1,
        link: 'https://tradescribe.io',
        stack: ['JavaScript', 'Python', 'React', 'Node.js', 'MongoDB'],
        blurb: 'Trade journalling and performance analytics for discretionary traders, with a copier for MT4 and MT5 accounts and tooling for running a trading community.',
    },
    {
        id: 'imagetools',
        kind: 'platform',
        band: 'web',
        name: 'ImageTools',
        date: 'Oct 2024',
        year: 2024.75,
        order: 2,
        link: 'https://imagetools.xyz',
        stack: ['JavaScript', 'React', 'Node.js', 'Python'],
        blurb: 'Browser image pipeline: resizing, compression, format conversion, and EXIF extraction without an upload round trip.',
    },
    {
        id: 'devcross',
        kind: 'extension',
        band: 'tooling',
        name: 'Devcross',
        date: 'Aug 2024',
        year: 2024.58,
        order: 2,
        link: 'https://marketplace.visualstudio.com/items?itemName=cyenite.devcross',
        stack: ['TypeScript', 'VS Code API', 'Gemini'],
        blurb: 'Generates developer-themed crossword puzzles inside the editor, seeded from your GitHub activity.',
    },
    {
        id: 'ohlc-stat-map',
        kind: 'instrument',
        band: 'quant',
        name: 'OHLC Stat Map',
        date: 'Jun 2024',
        year: 2024.42,
        order: 1,
        link: 'https://www.tradingview.com/script/1eHGSpPo-OHLC-Stat-Map-Cyenite/',
        stack: ['Pine Script', 'Statistics'],
        blurb: 'Identifies manipulation ranges and distribution levels by fitting normal and log-normal distributions to price extremes relative to the daily open.',
    },
    {
        id: 'chronomap',
        kind: 'instrument',
        band: 'quant',
        name: 'Chronomap',
        date: 'Apr 2024',
        year: 2024.25,
        order: 1,
        link: 'https://www.tradingview.com/script/eUJW9c7w-Chronomap-Cyenite/',
        stack: ['Pine Script', 'Technical analysis'],
        blurb: 'Maps market cycles and session boundaries under Quarterly Theory, with William’s Fractals and higher-timeframe candles overlaid.',
    },
    {
        id: 'lot-by-risk',
        kind: 'instrument',
        band: 'quant',
        name: 'Lot by Risk',
        date: 'Feb 2024',
        year: 2024.08,
        order: 2,
        link: 'https://ctrader.com/products/384',
        stack: ['C#', 'cTrader API'],
        blurb: 'cTrader tool that solves position size from a target risk percentage, so exposure stays fixed across instruments.',
    },
    {
        id: 'codescribe',
        kind: 'extension',
        band: 'tooling',
        name: 'Codescribe',
        date: 'Jul 2023',
        year: 2023.5,
        order: 1,
        link: 'https://plugins.jetbrains.com/plugin/22374-codescribe',
        stack: ['Kotlin', 'IntelliJ', 'Python', 'OpenAI'],
        blurb: 'IntelliJ plugin that drafts technical documentation from source, published on the JetBrains Marketplace.',
    },
    {
        id: 'getx-test',
        kind: 'package',
        band: 'tooling',
        name: 'GetX Test',
        date: 'Apr 2023',
        year: 2023.25,
        order: 2,
        link: 'https://pub.dev/packages/getx_test',
        stack: ['Flutter', 'Dart'],
        blurb: 'Testing utilities for GetX-managed state, published on pub.dev.',
    },
    {
        id: 'flutter-test-utils',
        kind: 'package',
        band: 'tooling',
        name: 'Flutter Test Utils',
        date: 'Mar 2023',
        year: 2023.17,
        order: 2,
        link: 'https://pub.dev/packages/flutter_test_utils',
        stack: ['Flutter', 'Dart'],
        blurb: 'Widget and BLoC test helpers, published on pub.dev.',
    },
    {
        id: 'easy-graphql',
        kind: 'package',
        band: 'tooling',
        name: 'Easy GraphQL',
        date: 'Mar 2023',
        year: 2023.17,
        order: 2,
        link: 'https://pub.dev/packages/easy_graphql',
        stack: ['Dart', 'Flutter', 'GraphQL'],
        blurb: 'A smaller surface for GraphQL queries, mutations, and subscriptions in Flutter. Published on pub.dev.',
    },
    {
        id: 'royale-gaming',
        kind: 'app',
        band: 'mobile',
        name: 'Royale Gaming',
        date: 'Aug 2022',
        year: 2022.58,
        order: 3,
        link: 'https://github.com/cyenite/Royale-Gaming-User',
        stack: ['Flutter', 'Dart', 'Firebase'],
        blurb: 'Tournament organiser for battle-royale titles: brackets, entries, and payouts.',
    },
    {
        id: 'forest-inventory',
        kind: 'research',
        band: 'spatial',
        name: 'Forest Inventory Management',
        date: 'Jul 2022',
        year: 2022.5,
        order: 2,
        link: 'https://github.com/cyenite/Forest-Inventory-Desktop',
        stack: ['Flutter', 'Dart', 'GIS', 'Python', 'TensorFlow', 'OpenCV', 'Qt'],
        blurb: 'Desktop system for forest inventory using GIS and remote sensing: stand delineation from imagery, species classification, and volume estimation.',
    },
    {
        id: 'bid-parlour',
        kind: 'app',
        band: 'mobile',
        name: 'Bid Parlour',
        date: 'Jun 2022',
        year: 2022.42,
        order: 3,
        link: 'https://github.com/cyenite/Bid-Parlour',
        stack: ['Flutter', 'Dart', 'Firebase', 'C++'],
        blurb: 'Live auction floor for monetary investment lots.',
    },
    {
        id: 'dekut-cu',
        kind: 'app',
        band: 'mobile',
        name: 'Dekut CU',
        date: 'Feb 2022',
        year: 2022.08,
        order: 2,
        link: 'https://github.com/cyenite/dekut_cu',
        stack: ['Flutter', 'Dart', 'Firebase', 'JavaScript'],
        blurb: 'Campus Christian Union app handling fellowships, bible studies, events, announcements, and offering.',
    },
    {
        id: 'gas-monitor',
        kind: 'research',
        band: 'spatial',
        name: 'Gas Monitor',
        date: 'Aug 2021',
        year: 2021.58,
        order: 2,
        link: 'https://github.com/cyenite/Gas-Monitoring',
        stack: ['STM32', 'C++', 'Flutter', 'Dart', 'Firebase'],
        blurb: 'Load-cell cylinder monitor on an STM32, streaming remaining gas mass to a phone.',
    },
    {
        id: 'tea-logistics',
        kind: 'research',
        band: 'spatial',
        name: 'Tea Collection & Logistics',
        date: 'Jun 2021',
        year: 2021.42,
        order: 2,
        link: 'https://github.com/cyenite/Tea-Collection-Management',
        stack: ['Flutter', 'Dart', 'Laravel', 'GIS', 'Leaflet'],
        blurb: 'Routes tea collection against grower locations and buying-centre capacity, using GIS for catchment and route planning.',
    },
    {
        id: 'ev-stations',
        kind: 'research',
        band: 'spatial',
        name: 'EV Station Finder',
        date: 'May 2021',
        year: 2021.33,
        order: 3,
        link: 'https://github.com/cyenite/EV-Stations',
        stack: ['Dart', 'Flutter'],
        blurb: 'Interface study for locating electric-vehicle charging points by range and connector type.',
    },
    {
        id: 'ficar',
        kind: 'app',
        band: 'mobile',
        name: 'Ficar Delivery',
        date: 'Dec 2020',
        year: 2020.92,
        order: 3,
        link: 'https://github.com/cyenite/Ficar-final-Mobile-app',
        stack: ['Flutter', 'Dart', 'Laravel', 'Firebase'],
        blurb: 'Courier and dispatch application built for Ficar Kenya.',
    },
    {
        id: 'piano',
        kind: 'app',
        band: 'mobile',
        name: 'Piano',
        date: 'Sep 2020',
        year: 2020.67,
        order: 3,
        link: 'https://github.com/cyenite/Piano',
        stack: ['Dart', 'Flutter', 'MIDI'],
        blurb: 'Minimal MIDI keyboard for phone and tablet.',
    },
    {
        id: 'ewaste',
        kind: 'app',
        band: 'mobile',
        name: 'E-Waste Manager',
        date: 'Sep 2020',
        year: 2020.67,
        order: 3,
        link: 'https://github.com/cyenite/Ewaste-Mobile',
        stack: ['Java', 'Kotlin', 'Laravel', 'Firebase'],
        blurb: 'Collection scheduling and tracking for electronic waste.',
    },
    {
        id: 'whatsapp-dm',
        kind: 'app',
        band: 'mobile',
        name: 'WhatsApp DM',
        date: 'Jul 2020',
        year: 2020.5,
        order: 3,
        link: 'https://github.com/cyenite/Whatsapp-DM',
        stack: ['Kotlin', 'Android'],
        blurb: 'Opens a WhatsApp thread to a number you have not saved as a contact.',
    },
    {
        id: 'clipboard-manager',
        kind: 'app',
        band: 'mobile',
        name: 'Clipboard Manager',
        date: 'May 2020',
        year: 2020.33,
        order: 3,
        link: 'https://github.com/cyenite/Clipboard-Manager',
        stack: ['Kotlin', 'Android'],
        blurb: 'Persistent clipboard history with search and pinning.',
    },
    {
        id: 'bookify',
        kind: 'app',
        band: 'mobile',
        name: 'Bookify',
        date: 'May 2020',
        year: 2020.33,
        order: 3,
        link: 'https://github.com/cyenite/Bookify',
        stack: ['Java', 'Kotlin', 'Laravel', 'Firebase'],
        blurb: 'Storefront for buying and renting e-books.',
    },
    {
        id: 'kazilink',
        kind: 'app',
        band: 'mobile',
        name: 'Kazilink',
        date: 'Feb 2020',
        year: 2020.08,
        order: 3,
        link: 'https://github.com/cyenite/Kazilink-Server',
        stack: ['Java', 'Kotlin', 'Laravel', 'Firebase'],
        blurb: 'Matches casual job seekers to employers by trade and locality.',
    },
    {
        id: 'dvorak-keyboard',
        kind: 'app',
        band: 'mobile',
        name: 'DVORAK Keyboard',
        date: 'Aug 2019',
        year: 2019.58,
        order: 3,
        link: 'https://github.com/cyenite/Dvorak-keyboard',
        stack: ['Java', 'Kotlin', 'Android'],
        blurb: 'Android input method implementing the Dvorak layout.',
    },
    {
        id: 'plant-signal',
        kind: 'research',
        band: 'spatial',
        name: 'Plant Signal',
        date: 'Jul 2019',
        year: 2019.5,
        order: 2,
        link: 'https://github.com/cyenite/Plant-Signal-Flutter',
        stack: ['Python', 'TensorFlow', 'Keras', 'Flutter'],
        blurb: 'Classifies plant disease from a leaf photograph, running the model on device.',
    },
    {
        id: 'telsms',
        kind: 'app',
        band: 'mobile',
        name: 'TELSMS',
        date: 'Jun 2019',
        year: 2019.42,
        order: 3,
        link: 'https://github.com/cyenite/TELSMS',
        stack: ['Java', 'Kotlin', 'Android'],
        blurb: 'Replacement SMS client with theming.',
    },
    {
        id: 'kva-player',
        kind: 'app',
        band: 'mobile',
        name: 'KVA Player',
        date: 'Jan 2019',
        year: 2019.0,
        order: 3,
        link: '',
        stack: ['Java', 'Kotlin', 'Android'],
        blurb: 'Music player with a parametric equaliser and bass boost.',
    },
    {
        id: 'dechat',
        kind: 'app',
        band: 'mobile',
        name: 'DeChat',
        date: 'Sep 2018',
        year: 2018.67,
        order: 2,
        link: 'https://github.com/cyenite/Dekut-Chat',
        stack: ['Java', 'Kotlin', 'Laravel', 'Firebase'],
        blurb: 'Campus social network for Dedan Kimathi students. The first thing here that other people used.',
    },
];

const SPAN_X = 3180;
const ORIGIN_X = 1180;

/** Time to plane easting. The survey sheet's horizontal axis is the calendar. */
export function xForYear(year) {
    return ORIGIN_X + ((year - EPOCH) / (HORIZON - EPOCH)) * SPAN_X;
}

export const YEAR_TICKS = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026].map((year) => ({
    year,
    x: xForYear(year),
}));

export const BAND_LABELS = [
    {
        id: 'tooling',
        y: BANDS.tooling,
        name: 'Developer tooling',
        note: 'extensions, packages',
        about: 'Editor extensions and published libraries: things other developers install and run inside their own projects.',
    },
    {
        id: 'mobile',
        y: BANDS.mobile,
        name: 'Mobile apps',
        note: 'Flutter, Android',
        about: 'Phone and tablet applications. The recent ones are Flutter and Dart; the early ones are native Android in Java and Kotlin.',
    },
    {
        id: 'web',
        y: BANDS.web,
        name: 'Web platforms',
        note: 'Laravel, Vue, React',
        about: 'Products with their own back end, database, and dashboard, rather than a single page.',
    },
    {
        id: 'quant',
        y: BANDS.quant,
        name: 'Market instruments',
        note: 'indicators, analytics',
        about: 'Tools for reading price: distribution models, market-cycle maps, position sizing, and trade analytics.',
    },
    {
        id: 'spatial',
        y: BANDS.spatial,
        name: 'Spatial & hardware',
        note: 'GIS, vision, embedded',
        about: 'Work carried over from the geomatics degree, plus hardware: mapping, remote sensing, machine vision, and microcontrollers.',
    },
];

/**
 * Tools grouped by what they are, so the list reads as a hierarchy rather than
 * a wall of tags. Counts are derived, so a new project cannot make them stale.
 */
export const TOOL_GROUPS = [
    {
        id: 'languages',
        name: 'Languages',
        items: ['Dart', 'TypeScript', 'JavaScript', 'Python', 'Kotlin', 'Java', 'C#', 'C++', 'PHP', 'Pine Script'],
    },
    {
        id: 'frameworks',
        name: 'Frameworks',
        items: ['Flutter', 'React', 'Vue', 'Laravel', 'Node.js', 'Qt'],
    },
    {
        id: 'data',
        name: 'Data & services',
        items: ['Firebase', 'MongoDB', 'GraphQL', 'OpenAI', 'Gemini'],
    },
    {
        id: 'spatial',
        name: 'Spatial & vision',
        items: ['GIS', 'Leaflet', 'TensorFlow', 'Keras', 'OpenCV'],
    },
    {
        id: 'platforms',
        name: 'Platforms',
        items: ['Android', 'STM32', 'VS Code API', 'IntelliJ', 'cTrader API', 'MIDI'],
    },
    {
        id: 'methods',
        name: 'Methods',
        items: ['Statistics', 'Technical analysis'],
    },
];

/** Deterministic offset from a station id, so the plot never reflows between renders. */
function seededOffset(id, spread) {
    let h = 2166136261;
    for (let i = 0; i < id.length; i += 1) {
        h ^= id.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    const unit = ((h >>> 8) % 2000) / 1000 - 1;
    return unit * spread;
}

/**
 * Label declutter.
 *
 * Two stations need separating only at the scale where both their labels are
 * on screen, and that scale comes from triangulation order: primaries are named
 * from the overview outward, so they need wide clearance in plane units, while
 * third-order labels only appear close in and need very little. Clearance is
 * therefore derived from each pair's gate rather than fixed, and stations are
 * relaxed apart inside their own band.
 */
const GATE_ZOOM = { 1: 0.19, 2: 0.62, 3: 0.98 };
const LABEL_W = 150;
const LABEL_H = 18;
const WIDEST_DX = LABEL_W / GATE_ZOOM[1];
const BAND_REACH = 210;

function declutter(stations) {
    const bands = {};
    for (const station of stations) {
        if (!bands[station.band]) bands[station.band] = [];
        bands[station.band].push(station);
    }

    for (const members of Object.values(bands)) {
        members.sort((a, b) => a.x - b.x);

        for (let pass = 0; pass < 60; pass += 1) {
            let moved = false;

            for (let i = 0; i < members.length; i += 1) {
                for (let j = i + 1; j < members.length; j += 1) {
                    const a = members[i];
                    const b = members[j];
                    if (b.x - a.x >= WIDEST_DX) break;

                    const zoom = GATE_ZOOM[Math.max(a.order, b.order)];
                    if (Math.abs(a.x - b.x) >= LABEL_W / zoom) continue;

                    const gap = b.y - a.y;
                    const deficit = LABEL_H / zoom - Math.abs(gap);
                    if (deficit <= 0) continue;

                    const push = (deficit / 2 + 1) * (gap >= 0 ? 1 : -1);
                    const home = BANDS[a.band];
                    a.y = Math.max(home - BAND_REACH, Math.min(home + BAND_REACH, a.y - push));
                    b.y = Math.max(home - BAND_REACH, Math.min(home + BAND_REACH, b.y + push));
                    moved = true;
                }
            }

            if (!moved) break;
        }
    }

    return stations;
}

export const STATIONS = declutter(
    PROJECTS.map((project, index) => ({
        ...project,
        index,
        glyph: KINDS[project.kind].glyph,
        kindLabel: KINDS[project.kind].label,
        x: ORIGIN_X + ((project.year - EPOCH) / (HORIZON - EPOCH)) * SPAN_X + seededOffset(project.id, 58),
        y: BANDS[project.band] + seededOffset(`${project.id}-y`, 186),
    }))
).sort((a, b) => a.index - b.index);

export const STATION_BY_ID = Object.fromEntries(STATIONS.map((s) => [s.id, s]));

export const TOOL_COUNTS = STATIONS.reduce((counts, station) => {
    for (const tool of station.stack) counts[tool] = (counts[tool] ?? 0) + 1;
    return counts;
}, {});

export const BAND_COUNTS = STATIONS.reduce((counts, station) => {
    counts[station.band] = (counts[station.band] ?? 0) + 1;
    return counts;
}, {});

export const TOOL_INDEX = TOOL_GROUPS.map((group) => ({
    ...group,
    items: group.items
        .map((name) => ({ name, count: TOOL_COUNTS[name] ?? 0 }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
}));
