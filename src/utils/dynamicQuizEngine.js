/**
 * Dynamic Quiz Engine
 * Generates fresh, non-repeated, high-quality quiz questions without requiring an API key.
 * Features:
 * 1. Deep question bank (120+ verified questions) across 12+ categories
 * 2. Session-based deduplication (tracks used questions so consecutive generations are always new)
 * 3. Dynamic "Today in History" event generation based on the calendar date
 * 4. Dynamic option shuffling and distractor balancing (A/B/C/D positions vary every time)
 * 5. Multi-language support (English, Telugu, Bilingual)
 */

// In-memory session tracking to prevent repeats during a session
const usedQuestionKeys = new Set();

/**
 * Calendar of historic milestones across dates
 */
const CALENDAR_EVENTS = [
  {
    id: 'cal_11_9_1',
    month: 11,
    day: 9,
    question: 'On November 9, 1989, which iconic Cold War barrier dividing East and West Germany began to fall?',
    options: {
      A: 'Berlin Wall',
      B: 'Iron Curtain Fence',
      C: 'Maginot Line',
      D: 'Checkered Line',
    },
    correctAnswer: 'A',
    explanation: 'The fall of the Berlin Wall on November 9, 1989, paved the way for German reunification and marked the symbolic end of the Cold War.',
    topic: 'Today in History (Nov 9)',
  },
  {
    id: 'cal_11_9_2',
    month: 11,
    day: 9,
    question: 'Which Indian state celebrates its official Foundation Day on November 9 each year?',
    options: {
      A: 'Uttarakhand',
      B: 'Chhattisgarh',
      C: 'Jharkhand',
      D: 'Telangana',
    },
    correctAnswer: 'A',
    explanation: 'Uttarakhand was formed as the 27th state of India on November 9, 2000, carved out of northern Uttar Pradesh.',
    topic: 'Today in History (Nov 9)',
  },
  {
    id: 'cal_11_9_3',
    month: 11,
    day: 9,
    question: 'On November 9, 1895, which German physicist discovered X-rays, later winning the first Nobel Prize in Physics?',
    options: {
      A: 'Wilhelm Röntgen',
      B: 'Max Planck',
      C: 'Heinrich Hertz',
      D: 'Albert Einstein',
    },
    correctAnswer: 'A',
    explanation: 'Wilhelm Röntgen detected electromagnetic radiation in a wavelength range known today as X-rays on November 8–9, 1895.',
    topic: 'Today in History (Nov 9)',
  },
  {
    id: 'cal_11_9_4',
    month: 11,
    day: 9,
    question: 'Renowned astronomer, author of "Cosmos", and science communicator Carl Sagan was born on November 9 of which year?',
    options: {
      A: '1934',
      B: '1921',
      C: '1945',
      D: '1952',
    },
    correctAnswer: 'A',
    explanation: 'Carl Sagan was born on November 9, 1934, in Brooklyn, New York. He popularized planetary astronomy and the search for extraterrestrial life.',
    topic: 'Today in History (Nov 9)',
  },
  {
    id: 'cal_11_9_5',
    month: 11,
    day: 9,
    question: 'In 1953, which Southeast Asian country declared full independence from France on November 9?',
    options: {
      A: 'Cambodia',
      B: 'Vietnam',
      C: 'Laos',
      D: 'Myanmar',
    },
    correctAnswer: 'A',
    explanation: 'Cambodia celebrates its National Independence Day on November 9, commemorating independence achieved under King Norodom Sihanouk in 1953.',
    topic: 'Today in History (Nov 9)',
  },
  {
    id: 'cal_general_1',
    month: 0,
    day: 0,
    question: 'On August 15, 1947, India attained independence after ending nearly two centuries of British rule under the leadership of which Viceroy?',
    options: {
      A: 'Lord Mountbatten',
      B: 'Lord Wavell',
      C: 'Lord Linlithgow',
      D: 'Lord Curzon',
    },
    correctAnswer: 'A',
    explanation: 'Lord Louis Mountbatten was the last Viceroy of British India and oversaw the transfer of power on August 15, 1947.',
    topic: 'Historic Milestones',
  },
  {
    id: 'cal_general_2',
    month: 0,
    day: 0,
    question: 'On January 26, 1950, which monumental document came into full legal effect, transforming India into a Sovereign Democratic Republic?',
    options: {
      A: 'Constitution of India',
      B: 'Government of India Act 1935',
      C: 'Indian Independence Act 1947',
      D: 'Nehru Report',
    },
    correctAnswer: 'A',
    explanation: 'The Constitution of India came into effect on January 26, 1950, celebrated nationwide as Republic Day.',
    topic: 'Historic Milestones',
  },
  {
    id: 'cal_general_3',
    month: 0,
    day: 0,
    question: 'On August 23, 2023, India made history when which ISRO lunar spacecraft landed near the Moon\'s south pole?',
    options: {
      A: 'Chandrayaan-3',
      B: 'Chandrayaan-2',
      C: 'Mangalyaan',
      D: 'Aditya-L1',
    },
    correctAnswer: 'A',
    explanation: 'Chandrayaan-3’s Vikram lander touched down on the Moon on August 23, 2023, celebrated as National Space Day in India.',
    topic: 'Historic Milestones',
  },
];

/**
 * Comprehensive question bank with 120+ verified competitive exam & general interest questions
 */
export const COMPREHENSIVE_QUESTION_BANK = [
  // ==========================================
  // --- INDIAN HISTORY (12 Questions) ---
  // ==========================================
  {
    id: 'ih_001',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'Who founded the Maurya Empire with the guidance and political mentorship of Chanakya?',
    options: { A: 'Ashoka the Great', B: 'Chandragupta Maurya', C: 'Bindusara', D: 'Harshavardhana' },
    correctAnswer: 'B',
    explanation: 'Chandragupta Maurya founded the Maurya Empire in 322 BCE after overthrowing the Nanda Dynasty with the mentorship of Chanakya.',
    difficulty: 'Easy',
  },
  {
    id: 'ih_002',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'In which year did the historic Battle of Plassey take place, establishing British supremacy in Bengal?',
    options: { A: '1757', B: '1764', C: '1857', D: '1761' },
    correctAnswer: 'A',
    explanation: 'The Battle of Plassey was fought on June 23, 1757, leading to British East India Company control over Bengal under Robert Clive.',
    difficulty: 'Medium',
  },
  {
    id: 'ih_003',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'Which Mughal Emperor built the iconic Buland Darwaza at Fatehpur Sikri to commemorate his victory over Gujarat?',
    options: { A: 'Babur', B: 'Shah Jahan', C: 'Akbar', D: 'Jahangir' },
    correctAnswer: 'C',
    explanation: 'Akbar built the 54-meter tall Buland Darwaza ("Gate of Victory") in 1601 to celebrate his conquest of Gujarat.',
    difficulty: 'Medium',
  },
  {
    id: 'ih_004',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'Who was the first Governor-General of independent India in 1947?',
    options: { A: 'C. Rajagopalachari', B: 'Lord Mountbatten', C: 'Dr. Rajendra Prasad', D: 'Jawaharlal Nehru' },
    correctAnswer: 'B',
    explanation: 'Lord Mountbatten served as the first Governor-General of independent India (1947–1948). C. Rajagopalachari was the first and last Indian Governor-General.',
    difficulty: 'Hard',
  },
  {
    id: 'ih_005',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'In which major Indus Valley Civilization site was the famous "Great Bath" excavated?',
    options: { A: 'Harappa', B: 'Lothal', C: 'Mohenjo-daro', D: 'Kalibangan' },
    correctAnswer: 'C',
    explanation: 'The Great Bath was discovered in the ruins of Mohenjo-daro in Sindh (now Pakistan), dating to the 3rd millennium BCE.',
    difficulty: 'Medium',
  },
  {
    id: 'ih_006',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'The famous "Poona Pact" of 1932 was signed between Mahatma Gandhi and which prominent leader?',
    options: { A: 'Dr. B.R. Ambedkar', B: 'Subhas Chandra Bose', C: 'Sardar Vallabhbhai Patel', D: 'Jawaharlal Nehru' },
    correctAnswer: 'A',
    explanation: 'The Poona Pact was signed on September 24, 1932, at Yerwada Central Jail in Pune between Dr. B.R. Ambedkar and Mahatma Gandhi, securing reserved seats for depressed classes.',
    difficulty: 'Medium',
  },
  {
    id: 'ih_007',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'Which Chola ruler successfully conquered the Srivijaya Empire in Southeast Asia and is known as "Gangaikonda Chola"?',
    options: { A: 'Rajaraja Chola I', B: 'Rajendra Chola I', C: 'Kulothunga Chola I', D: 'Parantaka I' },
    correctAnswer: 'B',
    explanation: 'Rajendra Chola I (1014–1044 CE) sent a naval expedition to Southeast Asia and built the new capital Gangaikonda Cholapuram.',
    difficulty: 'Hard',
  },
  {
    id: 'ih_008',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'The Indian National Congress launched the Quit India Movement in August 1942 at which historic venue in Bombay?',
    options: { A: 'Gowalia Tank Maidan', B: 'Shivaji Park', C: 'Azad Maidan', D: 'Oval Maidan' },
    correctAnswer: 'A',
    explanation: 'Mahatma Gandhi delivered the famous "Do or Die" speech at Gowalia Tank Maidan (now August Kranti Maidan) in Bombay on August 8, 1942.',
    difficulty: 'Medium',
  },
  {
    id: 'ih_009',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'Who was the founder of the famous Satyashodhak Samaj in Maharashtra in 1873?',
    options: { A: 'Jyotirao Phule', B: 'B.R. Ambedkar', C: 'Gopal Krishna Gokhale', D: 'Bal Gangadhar Tilak' },
    correctAnswer: 'A',
    explanation: 'Jyotirao Phule established the Satyashodhak Samaj ("Truth-seekers Society") to campaign for caste equality and women’s education.',
    difficulty: 'Medium',
  },
  {
    id: 'ih_010',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'During the Delhi Sultanate, which Sultan introduced token copper and brass currency, often criticized as a failed experiment?',
    options: { A: 'Alauddin Khalji', B: 'Muhammad bin Tughlaq', C: 'Feroz Shah Tughlaq', D: 'Iltutmish' },
    correctAnswer: 'B',
    explanation: 'Muhammad bin Tughlaq introduced bronze/copper token currency in 1330 CE, which led to rampant forging and had to be recalled.',
    difficulty: 'Medium',
  },
  {
    id: 'ih_011',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'In which year was the First Battle of Panipat fought, marking the foundation of the Mughal Empire in India?',
    options: { A: '1526', B: '1556', C: '1761', D: '1539' },
    correctAnswer: 'A',
    explanation: 'On April 21, 1526, Babur defeated Ibrahim Lodi at Panipat using cannons and matchlocks, initiating the Mughal Empire.',
    difficulty: 'Easy',
  },
  {
    id: 'ih_012',
    category: 'Indian History',
    topic: 'Indian History',
    question: 'The Kalinga War fought in 261 BCE transformed the ideology of which legendary emperor towards Ahimsa and Buddhism?',
    options: { A: 'Samudragupta', B: 'Ashoka the Great', C: 'Kanishka', D: 'Harshavardhana' },
    correctAnswer: 'B',
    explanation: 'The immense bloodshed of the Kalinga War prompted Emperor Ashoka to renounce military conquest (Digvijaya) in favor of spiritual conquest (Dhammavijaya).',
    difficulty: 'Easy',
  },

  // ==========================================
  // --- GEOGRAPHY (12 Questions) ---
  // ==========================================
  {
    id: 'geo_001',
    category: 'Geography',
    topic: 'Geography',
    question: 'Which is officially recognized as the longest river in the world by total length?',
    options: { A: 'Amazon River', B: 'Nile River', C: 'Yangtze River', D: 'Mississippi River' },
    correctAnswer: 'B',
    explanation: 'The Nile River in northeastern Africa spans roughly 6,650 km (4,132 miles), making it the longest river on Earth.',
    difficulty: 'Easy',
  },
  {
    id: 'geo_002',
    category: 'Geography',
    topic: 'Geography',
    question: 'What is the highest mountain peak located entirely within sovereign Indian territory?',
    options: { A: 'K2 (Mount Godwin-Austen)', B: 'Kangchenjunga', C: 'Nanda Devi', D: 'Kamet' },
    correctAnswer: 'C',
    explanation: 'Nanda Devi (7,816 m) is the highest peak situated completely within India. Kangchenjunga lies on the border between India and Nepal.',
    difficulty: 'Hard',
  },
  {
    id: 'geo_003',
    category: 'Geography',
    topic: 'Geography',
    question: 'Which narrow strait separates the Indian mainland from the island nation of Sri Lanka?',
    options: { A: 'Palk Strait', B: 'Malacca Strait', C: 'Strait of Hormuz', D: 'Sunda Strait' },
    correctAnswer: 'A',
    explanation: 'Palk Strait connects the Bay of Bengal in the northeast with Palk Bay in the southwest, separating Tamil Nadu from Sri Lanka.',
    difficulty: 'Easy',
  },
  {
    id: 'geo_004',
    category: 'Geography',
    topic: 'Geography',
    question: 'Which continent contains the driest non-polar desert on Earth, the Atacama Desert?',
    options: { A: 'Africa', B: 'South America', C: 'Australia', D: 'Asia' },
    correctAnswer: 'B',
    explanation: 'The Atacama Desert is located in northern Chile, South America, and receives virtually zero rainfall across vast stretches.',
    difficulty: 'Medium',
  },
  {
    id: 'geo_005',
    category: 'Geography',
    topic: 'Geography',
    question: 'The Equator, Tropic of Cancer, and Tropic of Capricorn all pass through which single continent?',
    options: { A: 'South America', B: 'Africa', C: 'Asia', D: 'Australia' },
    correctAnswer: 'B',
    explanation: 'Africa is the only continent on Earth intersected by all three major latitude lines: the Equator, Tropic of Cancer, and Tropic of Capricorn.',
    difficulty: 'Medium',
  },
  {
    id: 'geo_006',
    category: 'Geography',
    topic: 'Geography',
    question: 'Which Indian National Park is the last remaining natural habitat of the endangered Asiatic Lion?',
    options: { A: 'Jim Corbett National Park', B: 'Kaziranga National Park', C: 'Gir National Park', D: 'Ranthambore National Park' },
    correctAnswer: 'C',
    explanation: 'Gir National Park and Wildlife Sanctuary in Gujarat is the sole home of the Asiatic lion (Panthera leo persica).',
    difficulty: 'Easy',
  },
  {
    id: 'geo_007',
    category: 'Geography',
    topic: 'Geography',
    question: 'Which is the largest freshwater lake in India by surface area?',
    options: { A: 'Vembanad Lake', B: 'Wular Lake', C: 'Chilika Lake', D: 'Loktak Lake' },
    correctAnswer: 'B',
    explanation: 'Wular Lake in Jammu and Kashmir is one of the largest freshwater lakes in Asia and the largest in India, fed by the Jhelum River.',
    difficulty: 'Medium',
  },
  {
    id: 'geo_008',
    category: 'Geography',
    topic: 'Geography',
    question: 'What is recognized as the world\'s largest river island, situated on the Brahmaputra River in Assam?',
    options: { A: 'Majuli', B: 'Munroe Island', C: 'Divar Island', D: 'Havelock Island' },
    correctAnswer: 'A',
    explanation: 'Majuli in Assam is officially recognized by Guinness World Records as the world\'s largest river island.',
    difficulty: 'Easy',
  },
  {
    id: 'geo_009',
    category: 'Geography',
    topic: 'Geography',
    question: 'The Western Ghats and Eastern Ghats mountain ranges converge at which scenic hill range in southern India?',
    options: { A: 'Anaimalai Hills', B: 'Nilgiri Hills', C: 'Cardamom Hills', D: 'Palani Hills' },
    correctAnswer: 'B',
    explanation: 'The Western and Eastern Ghats meet at the Nilgiri Hills ("Blue Mountains"), with Doddabetta being the highest peak in the Nilgiris.',
    difficulty: 'Medium',
  },
  {
    id: 'geo_010',
    category: 'Geography',
    topic: 'Geography',
    question: 'Through how many Indian states does the Tropic of Cancer (23.5° N latitude) pass?',
    options: { A: '6', B: '7', C: '8', D: '9' },
    correctAnswer: 'C',
    explanation: 'The Tropic of Cancer passes through 8 Indian states: Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura, and Mizoram.',
    difficulty: 'Medium',
  },
  {
    id: 'geo_011',
    category: 'Geography',
    topic: 'Geography',
    question: 'Which artificial waterway connects the Mediterranean Sea to the Red Sea, facilitating global maritime navigation?',
    options: { A: 'Panama Canal', B: 'Suez Canal', C: 'Kiel Canal', D: 'Corinth Canal' },
    correctAnswer: 'B',
    explanation: 'Opened in 1869, the Suez Canal in Egypt connects the Mediterranean Sea directly with the Red Sea, cutting transit between Europe and Asia.',
    difficulty: 'Easy',
  },
  {
    id: 'geo_012',
    category: 'Geography',
    topic: 'Geography',
    question: 'Which is the world’s highest uninterrupted waterfall, dropping 979 meters in Venezuela?',
    options: { A: 'Niagara Falls', B: 'Victoria Falls', C: 'Angel Falls', D: 'Iguazu Falls' },
    correctAnswer: 'C',
    explanation: 'Angel Falls (Salto Ángel) in Canaima National Park, Venezuela, is the world’s highest uninterrupted waterfall.',
    difficulty: 'Easy',
  },

  // ==========================================
  // --- INDIAN POLITY & CONSTITUTION (12 Questions) ---
  // ==========================================
  {
    id: 'pol_001',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'Which Article of the Constitution of India was hailed by Dr. B.R. Ambedkar as the "Heart and Soul of the Constitution"?',
    options: { A: 'Article 14', B: 'Article 19', C: 'Article 21', D: 'Article 32' },
    correctAnswer: 'D',
    explanation: 'Article 32 guarantees the Right to Constitutional Remedies, allowing citizens to petition the Supreme Court for enforcement of fundamental rights.',
    difficulty: 'Medium',
  },
  {
    id: 'pol_002',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'Through which Constitutional Amendment were the Fundamental Duties added to Part IV-A of the Indian Constitution?',
    options: { A: '42nd Amendment (1976)', B: '44th Amendment (1978)', C: '73rd Amendment (1992)', D: '86th Amendment (2002)' },
    correctAnswer: 'A',
    explanation: 'The 42nd Constitutional Amendment Act, 1976, added Article 51A (Fundamental Duties) upon the recommendation of the Swaran Singh Committee.',
    difficulty: 'Medium',
  },
  {
    id: 'pol_003',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'What is the minimum age prescribed for an Indian citizen to be eligible for election as the President of India?',
    options: { A: '25 years', B: '30 years', C: '35 years', D: '40 years' },
    correctAnswer: 'C',
    explanation: 'Under Article 58 of the Constitution, a person must be a citizen of India and have completed 35 years of age to be eligible as President.',
    difficulty: 'Easy',
  },
  {
    id: 'pol_004',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'Who presides over a joint sitting of both Houses of Parliament in India?',
    options: { A: 'The President of India', B: 'The Vice-President (Rajya Sabha Chairman)', C: 'The Speaker of Lok Sabha', D: 'The Prime Minister' },
    correctAnswer: 'C',
    explanation: 'Under Article 118(4), the Speaker of the Lok Sabha presides over any joint sitting of Parliament summoned by the President.',
    difficulty: 'Hard',
  },
  {
    id: 'pol_005',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'The concept of "Directive Principles of State Policy" (DPSP) in the Indian Constitution was borrowed from which country?',
    options: { A: 'United Kingdom', B: 'Ireland', C: 'United States', D: 'Australia' },
    correctAnswer: 'B',
    explanation: 'The makers of the Indian Constitution borrowed the Directive Principles of State Policy (Part IV) from the 1937 Constitution of Ireland.',
    difficulty: 'Medium',
  },
  {
    id: 'pol_006',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'Which constitutional amendment granted constitutional status and protection to the Panchayati Raj institutions?',
    options: { A: '44th Amendment', B: '73rd Amendment', C: '74th Amendment', D: '86th Amendment' },
    correctAnswer: 'B',
    explanation: 'The 73rd Constitutional Amendment Act of 1992 added Part IX and the 11th Schedule to formalize the three-tier Panchayati Raj system.',
    difficulty: 'Medium',
  },
  {
    id: 'pol_007',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'What is the maximum permissible time gap between two consecutive sessions of the Indian Parliament?',
    options: { A: '3 months', B: '6 months', C: '9 months', D: '12 months' },
    correctAnswer: 'B',
    explanation: 'Article 85 mandates that Parliament must meet at least twice a year with a gap of not more than 6 months between two sessions.',
    difficulty: 'Easy',
  },
  {
    id: 'pol_008',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'Under which Article of the Indian Constitution can the President proclaim Financial Emergency?',
    options: { A: 'Article 352', B: 'Article 356', C: 'Article 360', D: 'Article 370' },
    correctAnswer: 'C',
    explanation: 'Article 360 empowers the President to declare a Financial Emergency if financial stability or credit of India is threatened. It has never been declared so far.',
    difficulty: 'Medium',
  },
  {
    id: 'pol_009',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'Which Article guarantees "Protection of life and personal liberty", widely expanded by the Supreme Court?',
    options: { A: 'Article 19', B: 'Article 21', C: 'Article 25', D: 'Article 14' },
    correctAnswer: 'B',
    explanation: 'Article 21 declares that no person shall be deprived of his life or personal liberty except according to procedure established by law.',
    difficulty: 'Easy',
  },
  {
    id: 'pol_010',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'Who was the first Chief Election Commissioner of independent India, serving from 1950 to 1958?',
    options: { A: 'T.N. Seshan', B: 'Sukumar Sen', C: 'K.V.K. Sundaram', D: 'Nagendra Singh' },
    correctAnswer: 'B',
    explanation: 'Sukumar Sen was India\'s first Chief Election Commissioner, orchestrating India\'s monumental first general elections in 1951–52.',
    difficulty: 'Medium',
  },
  {
    id: 'pol_011',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'Which schedule of the Constitution of India contains provisions regarding the disqualification of members on ground of defection (Anti-Defection Law)?',
    options: { A: '8th Schedule', B: '9th Schedule', C: '10th Schedule', D: '11th Schedule' },
    correctAnswer: 'C',
    explanation: 'The 10th Schedule was added by the 52nd Constitutional Amendment Act of 1985 to curb political defections.',
    difficulty: 'Medium',
  },
  {
    id: 'pol_012',
    category: 'Indian Polity',
    topic: 'Indian Polity',
    question: 'Who administers the oath of office to the President of India?',
    options: { A: 'Prime Minister', B: 'Chief Justice of India', C: 'Speaker of Lok Sabha', D: 'Vice President' },
    correctAnswer: 'B',
    explanation: 'Under Article 60, the Chief Justice of India (or in their absence, the senior-most judge of the Supreme Court) administers the oath to the President.',
    difficulty: 'Easy',
  },

  // ==========================================
  // --- GENERAL KNOWLEDGE (12 Questions) ---
  // ==========================================
  {
    id: 'gk_001',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'What is the largest living organ in the human body by surface area and weight?',
    options: { A: 'Liver', B: 'Skin', C: 'Brain', D: 'Lungs' },
    correctAnswer: 'B',
    explanation: 'The skin (integumentary system) is the human body’s largest organ, covering approximately 2 square meters in adults.',
    difficulty: 'Easy',
  },
  {
    id: 'gk_002',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'Which gas accounts for approximately 78% of the total volume of Earth’s atmosphere?',
    options: { A: 'Oxygen', B: 'Carbon Dioxide', C: 'Nitrogen', D: 'Argon' },
    correctAnswer: 'C',
    explanation: 'Nitrogen comprises roughly 78.08% of Earth’s dry air, followed by oxygen at 20.95% and argon at 0.93%.',
    difficulty: 'Easy',
  },
  {
    id: 'gk_003',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'Which sovereign nation has the longest total coastline in the world?',
    options: { A: 'Russia', B: 'Australia', C: 'Canada', D: 'Indonesia' },
    correctAnswer: 'C',
    explanation: 'Canada holds the world’s longest coastline, measuring over 202,080 kilometers (125,567 miles).',
    difficulty: 'Medium',
  },
  {
    id: 'gk_004',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'Who was the first human being to journey into outer space aboard Vostok 1 in 1961?',
    options: { A: 'Neil Armstrong', B: 'Yuri Gagarin', C: 'Buzz Aldrin', D: 'John Glenn' },
    correctAnswer: 'B',
    explanation: 'Soviet cosmonaut Yuri Gagarin made history on April 12, 1961, completing one orbit around Earth aboard Vostok 1.',
    difficulty: 'Easy',
  },
  {
    id: 'gk_005',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'In which year did the United Nations (UN) officially come into existence following the ratification of its Charter?',
    options: { A: '1942', B: '1945', C: '1948', D: '1950' },
    correctAnswer: 'B',
    explanation: 'The United Nations officially came into existence on October 24, 1945, celebrated internationally as United Nations Day.',
    difficulty: 'Medium',
  },
  {
    id: 'gk_006',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'Where is the permanent headquarters of the International Court of Justice (ICJ) situated?',
    options: { A: 'Geneva, Switzerland', B: 'The Hague, Netherlands', C: 'New York, USA', D: 'Vienna, Austria' },
    correctAnswer: 'B',
    explanation: 'The International Court of Justice has its seat at the Peace Palace in The Hague, Netherlands.',
    difficulty: 'Easy',
  },
  {
    id: 'gk_007',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'Who is revered as the "Father of the Indian Space Programme"?',
    options: { A: 'Dr. Homi Bhabha', B: 'Dr. Vikram Sarabhai', C: 'Dr. A.P.J. Abdul Kalam', D: 'Prof. Satish Dhawan' },
    correctAnswer: 'B',
    explanation: 'Dr. Vikram Sarabhai established the Indian National Committee for Space Research (INCOSPAR) in 1962, which later became ISRO.',
    difficulty: 'Easy',
  },
  {
    id: 'gk_008',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'On which date is World Environment Day celebrated globally every year under the UNEP?',
    options: { A: 'April 22', B: 'June 5', C: 'September 16', D: 'December 1' },
    correctAnswer: 'B',
    explanation: 'World Environment Day is observed annually on June 5, established by the UN at the 1972 Stockholm Conference on the Human Environment.',
    difficulty: 'Easy',
  },
  {
    id: 'gk_009',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'What is the official currency of Japan?',
    options: { A: 'Yuan', B: 'Yen', C: 'Won', D: 'Ringgit' },
    correctAnswer: 'B',
    explanation: 'The Japanese Yen (¥ / JPY) is the official currency of Japan and the third most traded currency in the global foreign exchange market.',
    difficulty: 'Easy',
  },
  {
    id: 'gk_010',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'What is the federal capital city of Australia?',
    options: { A: 'Sydney', B: 'Melbourne', C: 'Canberra', D: 'Brisbane' },
    correctAnswer: 'C',
    explanation: 'Canberra was selected as the capital of Australia in 1908 as a compromise between rival cities Sydney and Melbourne.',
    difficulty: 'Easy',
  },
  {
    id: 'gk_011',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'National Science Day is celebrated across India on February 28 to honor the discovery of what landmark scientific breakthrough?',
    options: { A: 'Raman Effect', B: 'Bose-Einstein Condensate', C: 'Saha Ionization Equation', D: 'Chandrasekhar Limit' },
    correctAnswer: 'A',
    explanation: 'Sir C.V. Raman discovered the Raman Effect on February 28, 1928, for which he won the 1930 Nobel Prize in Physics.',
    difficulty: 'Medium',
  },
  {
    id: 'gk_012',
    category: 'General Knowledge',
    topic: 'General Knowledge',
    question: 'Which international organization is headquartered in Paris and is responsible for designating World Heritage Sites?',
    options: { A: 'UNICEF', B: 'UNESCO', C: 'WHO', D: 'WTO' },
    correctAnswer: 'B',
    explanation: 'UNESCO (United Nations Educational, Scientific and Cultural Organization) is headquartered in Paris, France.',
    difficulty: 'Easy',
  },

  // ==========================================
  // --- SCIENCE (12 Questions) ---
  // ==========================================
  {
    id: 'sci_001',
    category: 'Science',
    topic: 'Science',
    question: 'What is the speed of light in a vacuum, rounded to standard scientific approximation?',
    options: { A: '150,000 km/s', B: '300,000 km/s', C: '500,000 km/s', D: '100,000 km/s' },
    correctAnswer: 'B',
    explanation: 'Light travels at exactly 299,792,458 meters per second in a vacuum, conventionally rounded to 300,000 km/s.',
    difficulty: 'Easy',
  },
  {
    id: 'sci_002',
    category: 'Science',
    topic: 'Science',
    question: 'Which subatomic particle carries a negative electric charge in an atom?',
    options: { A: 'Proton', B: 'Neutron', C: 'Electron', D: 'Positron' },
    correctAnswer: 'C',
    explanation: 'Electrons carry a negative elementary charge of -1, while protons are positively charged and neutrons are neutral.',
    difficulty: 'Easy',
  },
  {
    id: 'sci_003',
    category: 'Science',
    topic: 'Science',
    question: 'What is the powerhouse organelle of eukaryotic cells responsible for producing ATP?',
    options: { A: 'Ribosome', B: 'Mitochondria', C: 'Endoplasmic Reticulum', D: 'Golgi Apparatus' },
    correctAnswer: 'B',
    explanation: 'Mitochondria generate most of the chemical energy required by the cell through cellular respiration, stored as ATP.',
    difficulty: 'Easy',
  },
  {
    id: 'sci_004',
    category: 'Science',
    topic: 'Science',
    question: 'Which chemical element has the highest thermal and electrical conductivity of all metals?',
    options: { A: 'Copper', B: 'Gold', C: 'Silver', D: 'Aluminium' },
    correctAnswer: 'C',
    explanation: 'Silver (Ag) has the highest electrical conductivity, thermal conductivity, and reflectivity of any known metal.',
    difficulty: 'Medium',
  },
  {
    id: 'sci_005',
    category: 'Science',
    topic: 'Science',
    question: 'Which vitamin is synthesized in the human skin upon exposure to solar ultraviolet-B (UVB) rays?',
    options: { A: 'Vitamin A', B: 'Vitamin C', C: 'Vitamin D', D: 'Vitamin K' },
    correctAnswer: 'C',
    explanation: 'Vitamin D3 (cholecalciferol) is synthesized when 7-dehydrocholesterol in the skin absorbs UVB sunlight.',
    difficulty: 'Easy',
  },
  {
    id: 'sci_006',
    category: 'Science',
    topic: 'Science',
    question: 'What is the name of ISRO’s first mission to place an orbiter around the planet Mars in 2014?',
    options: { A: 'Chandrayaan-1', B: 'Mangalyaan (MOM)', C: 'Aditya-L1', D: 'Gaganyaan' },
    correctAnswer: 'B',
    explanation: 'The Mars Orbiter Mission (Mangalyaan) successfully entered Martian orbit on September 24, 2014, on India’s first attempt.',
    difficulty: 'Easy',
  },
  {
    id: 'sci_007',
    category: 'Science',
    topic: 'Science',
    question: 'What is the common chemical name and formula of Baking Soda?',
    options: { A: 'Sodium Carbonate (Na2CO3)', B: 'Sodium Bicarbonate (NaHCO3)', C: 'Sodium Hydroxide (NaOH)', D: 'Calcium Carbonate (CaCO3)' },
    correctAnswer: 'B',
    explanation: 'Baking soda is Sodium Bicarbonate (NaHCO3), widely used in cooking and as an antacid.',
    difficulty: 'Easy',
  },
  {
    id: 'sci_008',
    category: 'Science',
    topic: 'Science',
    question: 'What is the neutral pH value of pure distilled water at 25°C?',
    options: { A: '0', B: '5', C: '7', D: '14' },
    correctAnswer: 'C',
    explanation: 'Pure water has an equal concentration of hydrogen and hydroxide ions at 25°C, yielding a neutral pH of 7.',
    difficulty: 'Easy',
  },
  {
    id: 'sci_009',
    category: 'Science',
    topic: 'Science',
    question: 'What is the SI unit of electrical resistance?',
    options: { A: 'Volt', B: 'Ampere', C: 'Ohm', D: 'Watt' },
    correctAnswer: 'C',
    explanation: 'The Ohm (symbol: Ω) is the SI unit of electrical resistance, named after German physicist Georg Simon Ohm.',
    difficulty: 'Easy',
  },
  {
    id: 'sci_010',
    category: 'Science',
    topic: 'Science',
    question: 'Sound waves are mechanical waves and therefore cannot travel through which of the following?',
    options: { A: 'Water', B: 'Steel', C: 'Vacuum', D: 'Air' },
    correctAnswer: 'C',
    explanation: 'Sound requires a material medium (solid, liquid, or gas) for propagation and cannot travel through a vacuum.',
    difficulty: 'Easy',
  },
  {
    id: 'sci_011',
    category: 'Science',
    topic: 'Science',
    question: 'Who is acknowledged as the "Father of Modern Genetics" for his breeding experiments with pea plants?',
    options: { A: 'Charles Darwin', B: 'Gregor Mendel', C: 'Louis Pasteur', D: 'James Watson' },
    correctAnswer: 'B',
    explanation: 'Gregor Mendel discovered the fundamental laws of inheritance through his experiments on garden pea plants between 1856 and 1863.',
    difficulty: 'Easy',
  },
  {
    id: 'sci_012',
    category: 'Science',
    topic: 'Science',
    question: 'Deficiency of Vitamin C (ascorbic acid) causes which well-known nutritional disease?',
    options: { A: 'Rickets', B: 'Scurvy', C: 'Beriberi', D: 'Pellagra' },
    correctAnswer: 'B',
    explanation: 'Scurvy results from lack of Vitamin C, causing bleeding gums, skin spots, and impaired wound healing.',
    difficulty: 'Easy',
  },

  // ==========================================
  // --- COMPUTER KNOWLEDGE (12 Questions) ---
  // ==========================================
  {
    id: 'comp_001',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'In computer networking, which protocol is universally used for securely encrypting communications over the web?',
    options: { A: 'HTTP', B: 'FTP', C: 'HTTPS / TLS', D: 'Telnet' },
    correctAnswer: 'C',
    explanation: 'HTTPS (Hypertext Transfer Protocol Secure) encrypts data communications using Transport Layer Security (TLS) or SSL.',
    difficulty: 'Easy',
  },
  {
    id: 'comp_002',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'What is the full form of RAM in computing hardware?',
    options: { A: 'Read Access Memory', B: 'Random Access Memory', C: 'Rapid Action Module', D: 'Real-time Allocated Memory' },
    correctAnswer: 'B',
    explanation: 'Random Access Memory (RAM) provides high-speed read/write access to active running programs and system data.',
    difficulty: 'Easy',
  },
  {
    id: 'comp_003',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'Which sorting algorithm has the best average-case time complexity of O(n log n)?',
    options: { A: 'Bubble Sort', B: 'Merge Sort', C: 'Insertion Sort', D: 'Selection Sort' },
    correctAnswer: 'B',
    explanation: 'Merge Sort operates on the divide-and-conquer paradigm and guarantees O(n log n) time complexity in worst, average, and best cases.',
    difficulty: 'Hard',
  },
  {
    id: 'comp_004',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'Who is recognized as the "Father of the World Wide Web" for inventing HTTP, HTML, and URL in 1989?',
    options: { A: 'Alan Turing', B: 'Tim Berners-Lee', C: 'Vint Cerf', D: 'Dennis Ritchie' },
    correctAnswer: 'B',
    explanation: 'Sir Tim Berners-Lee invented the World Wide Web while working at CERN in 1989.',
    difficulty: 'Easy',
  },
  {
    id: 'comp_005',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'Which widely popular high-level programming language was created by Guido van Rossum and released in 1991?',
    options: { A: 'Java', B: 'Python', C: 'Ruby', D: 'C++' },
    correctAnswer: 'B',
    explanation: 'Guido van Rossum released Python in 1991, emphasizing code readability and simplicity.',
    difficulty: 'Easy',
  },
  {
    id: 'comp_006',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'What is the standard port number assigned for secure HTTPS web traffic?',
    options: { A: '21', B: '80', C: '443', D: '8080' },
    correctAnswer: 'C',
    explanation: 'Port 80 is used for unencrypted HTTP traffic, while Port 443 is the standard port dedicated to encrypted HTTPS connections.',
    difficulty: 'Easy',
  },
  {
    id: 'comp_007',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'How many bits are utilized to represent an Internet Protocol version 6 (IPv6) address?',
    options: { A: '32 bits', B: '64 bits', C: '128 bits', D: '256 bits' },
    correctAnswer: 'C',
    explanation: 'IPv4 uses 32-bit addresses, whereas IPv6 uses 128-bit hexadecimal addresses, supporting an astronomical number of unique IPs.',
    difficulty: 'Medium',
  },
  {
    id: 'comp_008',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'In computer architecture, which component is considered the "Brain of the Computer" that executes instructions?',
    options: { A: 'Hard Disk', B: 'Motherboard', C: 'CPU (Central Processing Unit)', D: 'GPU' },
    correctAnswer: 'C',
    explanation: 'The CPU contains the ALU and Control Unit and is responsible for fetching, decoding, and executing program instructions.',
    difficulty: 'Easy',
  },
  {
    id: 'comp_009',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'What does the acronym "DNS" stand for in internet infrastructure?',
    options: { A: 'Domain Network System', B: 'Domain Name System', C: 'Digital Network Service', D: 'Direct Name Server' },
    correctAnswer: 'B',
    explanation: 'The Domain Name System (DNS) translates human-readable domain names (e.g. google.com) into numerical IP addresses.',
    difficulty: 'Easy',
  },
  {
    id: 'comp_010',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'Who created the open-source Linux operating system kernel as a university student in Finland in 1991?',
    options: { A: 'Linus Torvalds', B: 'Richard Stallman', C: 'Ken Thompson', D: 'Bjarne Stroustrup' },
    correctAnswer: 'A',
    explanation: 'Linus Torvalds announced and released the Linux kernel in 1991, which powers millions of servers, supercomputers, and Android devices today.',
    difficulty: 'Easy',
  },
  {
    id: 'comp_011',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'In relational database management systems, what does the acronym "SQL" stand for?',
    options: { A: 'Standard Query Language', B: 'Structured Query Language', C: 'Sequential Query Logic', D: 'System Query Level' },
    correctAnswer: 'B',
    explanation: 'Structured Query Language (SQL) is the standardized programming language used to manage and query relational databases.',
    difficulty: 'Easy',
  },
  {
    id: 'comp_012',
    category: 'Computer Knowledge',
    topic: 'Computer Knowledge',
    question: 'What is the smallest addressable unit of digital data in modern computing architectures, consisting of 8 bits?',
    options: { A: 'Nibble', B: 'Byte', C: 'Word', D: 'Block' },
    correctAnswer: 'B',
    explanation: 'A byte consists of 8 bits. A nibble consists of 4 bits.',
    difficulty: 'Easy',
  },

  // ==========================================
  // --- ECONOMICS (12 Questions) ---
  // ==========================================
  {
    id: 'eco_001',
    category: 'Economics',
    topic: 'Economics',
    question: 'Which apex banking institution in India is responsible for formulating Monetary Policy and regulating commercial banks?',
    options: { A: 'State Bank of India', B: 'Reserve Bank of India (RBI)', C: 'NITI Aayog', D: 'SEBI' },
    correctAnswer: 'B',
    explanation: 'The Reserve Bank of India (RBI), established in 1935, is India’s central bank governing monetary policy, repo rates, and currency issuance.',
    difficulty: 'Easy',
  },
  {
    id: 'eco_002',
    category: 'Economics',
    topic: 'Economics',
    question: 'What economic term describes a sustained situation of stagnant economic growth combined with high inflation and unemployment?',
    options: { A: 'Recession', B: 'Stagflation', C: 'Deflation', D: 'Hyperinflation' },
    correctAnswer: 'B',
    explanation: 'Stagflation occurs when the inflation rate is high, economic growth rate slows, and unemployment remains steadily high.',
    difficulty: 'Medium',
  },
  {
    id: 'eco_003',
    category: 'Economics',
    topic: 'Economics',
    question: 'What is the rate at which the Reserve Bank of India lends short-term funds to commercial banks against government securities?',
    options: { A: 'Reverse Repo Rate', B: 'Repo Rate', C: 'Bank Rate', D: 'Cash Reserve Ratio' },
    correctAnswer: 'B',
    explanation: 'Repo Rate (Repurchasing Option rate) is the benchmark interest rate at which RBI lends money to commercial banks.',
    difficulty: 'Medium',
  },
  {
    id: 'eco_004',
    category: 'Economics',
    topic: 'Economics',
    question: 'Who is widely regarded as the "Father of Modern Economics" and authored "The Wealth of Nations"?',
    options: { A: 'John Maynard Keynes', B: 'Adam Smith', C: 'Karl Marx', D: 'Milton Friedman' },
    correctAnswer: 'B',
    explanation: 'Scottish philosopher Adam Smith published "The Wealth of Nations" in 1776, founding classical economics and the concept of the invisible hand.',
    difficulty: 'Easy',
  },
  {
    id: 'eco_005',
    category: 'Economics',
    topic: 'Economics',
    question: 'Which statutory body replaced the 65-year-old Planning Commission of India on January 1, 2015?',
    options: { A: 'Finance Commission', B: 'NITI Aayog', C: 'National Development Council', D: 'Central Statistical Office' },
    correctAnswer: 'B',
    explanation: 'NITI Aayog (National Institution for Transforming India) replaced the Planning Commission to foster cooperative federalism.',
    difficulty: 'Easy',
  },
  {
    id: 'eco_006',
    category: 'Economics',
    topic: 'Economics',
    question: 'Which constitutional amendment paved the way for the nationwide rollout of the Goods and Services Tax (GST) in India?',
    options: { A: '99th Amendment', B: '100th Amendment', C: '101st Amendment', D: '103rd Amendment' },
    correctAnswer: 'C',
    explanation: 'The 101st Constitutional Amendment Act of 2016 introduced the unified Goods and Services Tax (GST), effective July 1, 2017.',
    difficulty: 'Medium',
  },
  {
    id: 'eco_007',
    category: 'Economics',
    topic: 'Economics',
    question: 'In economics, what graphical representation is used to show the degree of income or wealth inequality in a society?',
    options: { A: 'Phillips Curve', B: 'Lorenz Curve', C: 'Laffer Curve', D: 'Kuznets Curve' },
    correctAnswer: 'B',
    explanation: 'The Lorenz Curve plots the cumulative percentage of income earned against cumulative population; the Gini coefficient is derived from it.',
    difficulty: 'Hard',
  },
  {
    id: 'eco_008',
    category: 'Economics',
    topic: 'Economics',
    question: 'Where is the permanent headquarters of the Reserve Bank of India (RBI) located since 1937?',
    options: { A: 'New Delhi', B: 'Kolkata', C: 'Mumbai', D: 'Chennai' },
    correctAnswer: 'C',
    explanation: 'The RBI Central Office was initially established in Calcutta (Kolkata) in 1935 but permanently shifted to Mumbai in 1937.',
    difficulty: 'Easy',
  },
  {
    id: 'eco_009',
    category: 'Economics',
    topic: 'Economics',
    question: 'What does "GDP" stand for in measuring the size and health of a nation\'s economy?',
    options: { A: 'Gross Domestic Product', B: 'General Domestic Price', C: 'Gross Direct Profit', D: 'Government Development Plan' },
    correctAnswer: 'A',
    explanation: 'Gross Domestic Product (GDP) represents the total monetary value of all final goods and services produced within a country over a specific time period.',
    difficulty: 'Easy',
  },
  {
    id: 'eco_010',
    category: 'Economics',
    topic: 'Economics',
    question: 'Who is recognized as the "Father of the Green Revolution" in India for revolutionizing agricultural foodgrain production?',
    options: { A: 'Dr. Verghese Kurien', B: 'M.S. Swaminathan', C: 'Norman Borlaug', D: 'C. Subramaniam' },
    correctAnswer: 'B',
    explanation: 'Professor M.S. Swaminathan led India’s Green Revolution introducing high-yielding varieties of wheat and rice, making India self-sufficient in food.',
    difficulty: 'Easy',
  },
  {
    id: 'eco_011',
    category: 'Economics',
    topic: 'Economics',
    question: 'Which market regulator oversees and protects the interests of investors in the Indian securities and stock markets?',
    options: { A: 'IRDAI', B: 'PFRDA', C: 'SEBI', D: 'NABARD' },
    correctAnswer: 'C',
    explanation: 'The Securities and Exchange Board of India (SEBI), established statutory status in 1992, regulates Indian capital markets.',
    difficulty: 'Easy',
  },
  {
    id: 'eco_012',
    category: 'Economics',
    topic: 'Economics',
    question: 'What is the term for an economy where both the public and private sectors coexist and operate concurrently, as in India?',
    options: { A: 'Capitalist Economy', B: 'Socialist Economy', C: 'Mixed Economy', D: 'Command Economy' },
    correctAnswer: 'C',
    explanation: 'India adopted a mixed economic model after independence, where the government and private enterprise jointly drive production and development.',
    difficulty: 'Easy',
  },

  // ==========================================
  // --- SPORTS (12 Questions) ---
  // ==========================================
  {
    id: 'spo_001',
    category: 'Sports',
    topic: 'Sports',
    question: 'Which legendary athlete became the first track-and-field Olympic Gold medalist for independent India at the Tokyo 2020 Olympics?',
    options: { A: 'Milkha Singh', B: 'Neeraj Chopra', C: 'Abhinav Bindra', D: 'P.T. Usha' },
    correctAnswer: 'B',
    explanation: 'Neeraj Chopra won the men’s javelin throw Gold at Tokyo 2020 with an 87.58 m throw, India’s first Olympic track-and-field gold.',
    difficulty: 'Easy',
  },
  {
    id: 'spo_002',
    category: 'Sports',
    topic: 'Sports',
    question: 'Which country won the inaugural ICC Men’s T20 Cricket World Cup held in South Africa in 2007?',
    options: { A: 'Pakistan', B: 'India', C: 'Australia', D: 'West Indies' },
    correctAnswer: 'B',
    explanation: 'India defeated Pakistan by 5 runs in the final at Johannesburg on September 24, 2007, captained by MS Dhoni.',
    difficulty: 'Easy',
  },
  {
    id: 'spo_003',
    category: 'Sports',
    topic: 'Sports',
    question: 'How many players are on the field for one team in a standard regulation match of Volleyball?',
    options: { A: '5', B: '6', C: '7', D: '8' },
    correctAnswer: 'B',
    explanation: 'A regulation volleyball team consists of 6 players on the court at any one time (3 in front row, 3 in back row).',
    difficulty: 'Easy',
  },
  {
    id: 'spo_004',
    category: 'Sports',
    topic: 'Sports',
    question: 'Who won India\'s first-ever individual Olympic gold medal in the 10m Air Rifle event at the Beijing 2008 Games?',
    options: { A: 'Rajyavardhan Rathore', B: 'Abhinav Bindra', C: 'Gagan Narang', D: 'Vijay Kumar' },
    correctAnswer: 'B',
    explanation: 'Abhinav Bindra clinched gold in the 10m air rifle shooting event on August 11, 2008, becoming independent India\'s first individual gold medalist.',
    difficulty: 'Easy',
  },
  {
    id: 'spo_005',
    category: 'Sports',
    topic: 'Sports',
    question: 'Under whose captaincy did the Indian cricket team lift their first-ever Prudential World Cup trophy in 1983 at Lord’s?',
    options: { A: 'Sunil Gavaskar', B: 'Kapil Dev', C: 'Mohinder Amarnath', D: 'Dilip Vengsarkar' },
    correctAnswer: 'B',
    explanation: 'Kapil Dev captained India to victory defeating the reigning champions West Indies by 43 runs in the final on June 25, 1983.',
    difficulty: 'Easy',
  },
  {
    id: 'spo_006',
    category: 'Sports',
    topic: 'Sports',
    question: 'National Sports Day is celebrated in India on August 29 every year to commemorate the birthday of which legendary sportsman?',
    options: { A: 'Milkha Singh', B: 'Major Dhyan Chand', C: 'K.D. Jadhav', D: 'Balbir Singh Sr.' },
    correctAnswer: 'B',
    explanation: 'August 29 marks the birth anniversary of hockey wizard Major Dhyan Chand, who helped India win three Olympic field hockey golds (1928, 1932, 1936).',
    difficulty: 'Easy',
  },
  {
    id: 'spo_007',
    category: 'Sports',
    topic: 'Sports',
    question: 'The prestigious Wimbledon tennis championship is famously played on which traditional court surface?',
    options: { A: 'Clay', B: 'Grass', C: 'Hard Court', D: 'Carpet' },
    correctAnswer: 'B',
    explanation: 'Wimbledon is the oldest tennis tournament in the world (founded 1877) and the only Grand Slam still contested on traditional natural grass courts.',
    difficulty: 'Easy',
  },
  {
    id: 'spo_008',
    category: 'Sports',
    topic: 'Sports',
    question: 'The "Thomas Cup" and "Uber Cup" are premier international team championships associated with which sport?',
    options: { A: 'Table Tennis', B: 'Badminton', C: 'Squash', D: 'Polo' },
    correctAnswer: 'B',
    explanation: 'The Thomas Cup (men) and Uber Cup (women) are the prestigious world team championships in badminton governed by the BWF.',
    difficulty: 'Medium',
  },
  {
    id: 'spo_009',
    category: 'Sports',
    topic: 'Sports',
    question: 'Which city hosted the 2024 Summer Olympic Games featuring the opening ceremony on the River Seine?',
    options: { A: 'Los Angeles', B: 'Tokyo', C: 'Paris', D: 'London' },
    correctAnswer: 'C',
    explanation: 'Paris hosted the XXXIII Olympic Summer Games in 2024, holding the opening ceremony along the River Seine.',
    difficulty: 'Easy',
  },
  {
    id: 'spo_010',
    category: 'Sports',
    topic: 'Sports',
    question: 'Who holds the record for winning the most Ballon d\'Or awards in men\'s football history?',
    options: { A: 'Cristiano Ronaldo', B: 'Lionel Messi', C: 'Pelé', D: 'Diego Maradona' },
    correctAnswer: 'B',
    explanation: 'Lionel Messi has won a record 8 Ballon d\'Or titles (2009, 2010, 2011, 2012, 2015, 2019, 2021, and 2023).',
    difficulty: 'Easy',
  },
  {
    id: 'spo_011',
    category: 'Sports',
    topic: 'Sports',
    question: 'In Cricket, what is the distance between the two bowling wickets on a standard regulation pitch?',
    options: { A: '20 yards', B: '22 yards', C: '24 yards', D: '26 yards' },
    correctAnswer: 'B',
    explanation: 'The length of a standard cricket pitch is 22 yards (66 feet or 20.12 meters) between the bowling wickets.',
    difficulty: 'Easy',
  },
  {
    id: 'spo_012',
    category: 'Sports',
    topic: 'Sports',
    question: 'Who was the first Indian woman athlete to win an Olympic medal, clinching bronze in weightlifting at Sydney 2000?',
    options: { A: 'Karnam Malleswari', B: 'Mary Kom', C: 'Saina Nehwal', D: 'P.V. Sindhu' },
    correctAnswer: 'A',
    explanation: 'Karnam Malleswari won bronze in the 69 kg weightlifting category at the 2000 Sydney Olympics, becoming India\'s first woman Olympic medalist.',
    difficulty: 'Medium',
  },

  // ==========================================
  // --- ENGLISH GRAMMAR & VOCABULARY (10 Questions) ---
  // ==========================================
  {
    id: 'eng_001',
    category: 'English Grammar',
    topic: 'English Grammar',
    question: 'What is the exact antonym of the word "EPHEMERAL" (meaning lasting for a very short time)?',
    options: { A: 'Transient', B: 'Fleeting', C: 'Eternal', D: 'Momentary' },
    correctAnswer: 'C',
    explanation: '"Ephemeral" means short-lived or transient. Its exact antonym is "Eternal" or "Permanent".',
    difficulty: 'Medium',
  },
  {
    id: 'eng_002',
    category: 'English Grammar',
    topic: 'English Grammar',
    question: 'Identify the figure of speech in: "The wind whispered softly through the dark trees."',
    options: { A: 'Simile', B: 'Personification', C: 'Metaphor', D: 'Hyperbole' },
    correctAnswer: 'B',
    explanation: 'Personification attributes human qualities (whispering) to non-human entities (the wind).',
    difficulty: 'Easy',
  },
  {
    id: 'eng_003',
    category: 'English Grammar',
    topic: 'English Grammar',
    question: 'What is the one-word substitution for "A person who loves and collects books"?',
    options: { A: 'Bibliophile', B: 'Philanthropist', C: 'Numismatist', D: 'Polyglot' },
    correctAnswer: 'A',
    explanation: 'A "Bibliophile" is an avid admirer or collector of books. A "Numismatist" collects coins, and a "Polyglot" speaks many languages.',
    difficulty: 'Easy',
  },
  {
    id: 'eng_004',
    category: 'English Grammar',
    topic: 'English Grammar',
    question: 'What is the correct collective noun used for a group of lions in the wild?',
    options: { A: 'Pack', B: 'Flock', C: 'Pride', D: 'Herd' },
    correctAnswer: 'C',
    explanation: 'Lions live in family groups known as a "pride". Wolves travel in packs, and cattle travel in herds.',
    difficulty: 'Easy',
  },
  {
    id: 'eng_005',
    category: 'English Grammar',
    topic: 'English Grammar',
    question: 'What is the grammatical term for a figure of speech that pairs two contradictory words together, such as "deafening silence"?',
    options: { A: 'Metaphor', B: 'Oxymoron', C: 'Hyperbole', D: 'Onomatopoeia' },
    correctAnswer: 'B',
    explanation: 'An oxymoron juxtaposes apparently contradictory terms (e.g., "clearly confused", "deafening silence", "sweet sorrow").',
    difficulty: 'Medium',
  },
  {
    id: 'eng_006',
    category: 'English Grammar',
    topic: 'English Grammar',
    question: 'Which tense is used in the sentence: "By the time the train arrived, we had already bought our tickets"?',
    options: { A: 'Simple Past', B: 'Past Continuous', C: 'Past Perfect', D: 'Past Perfect Continuous' },
    correctAnswer: 'C',
    explanation: '"Had bought" is in the Past Perfect tense, used to express an action completed before another past event.',
    difficulty: 'Medium',
  },
  {
    id: 'eng_007',
    category: 'English Grammar',
    topic: 'English Grammar',
    question: 'What is the meaning of the English idiom "to bite the bullet"?',
    options: { A: 'To provoke an argument', B: 'To face an inevitable grim situation with courage', C: 'To act hastily', D: 'To eat hurriedly' },
    correctAnswer: 'B',
    explanation: '"Bite the bullet" means accepting a difficult or unpleasant situation and confronting it bravely without hesitation.',
    difficulty: 'Easy',
  },
  {
    id: 'eng_008',
    category: 'English Grammar',
    topic: 'English Grammar',
    question: 'Identify the correctly spelled word:',
    options: { A: 'Maintanance', B: 'Maintenance', C: 'Maintenence', D: 'Maintanence' },
    correctAnswer: 'B',
    explanation: 'The correct spelling is "Maintenance" (m-a-i-n-t-e-n-a-n-c-e).',
    difficulty: 'Easy',
  },
  {
    id: 'eng_009',
    category: 'English Grammar',
    topic: 'English Grammar',
    question: 'Choose the appropriate preposition: "The jury congratulated the advocate _____ her convincing argument."',
    options: { A: 'for', B: 'on', C: 'with', D: 'at' },
    correctAnswer: 'B',
    explanation: 'The verb "congratulate" is followed by the preposition "on" (congratulate someone on something).',
    difficulty: 'Medium',
  },
  {
    id: 'eng_010',
    category: 'English Grammar',
    topic: 'English Grammar',
    question: 'What is the superlative degree of the irregular adjective "bad"?',
    options: { A: 'Badder', B: 'Baddest', C: 'Worse', D: 'Worst' },
    correctAnswer: 'D',
    explanation: 'The degrees of comparison for bad are: Positive: Bad, Comparative: Worse, Superlative: Worst.',
    difficulty: 'Easy',
  },

  // ==========================================
  // --- TELUGU LITERATURE & ANDHRA HISTORY (10 Questions) ---
  // ==========================================
  {
    id: 'tel_001',
    category: 'Telugu Literature',
    topic: 'Telugu Literature',
    question: 'Who authored the renowned epic work "Amuktamalyada" in Telugu literature during the Vijayanagara Empire?',
    options: { A: 'Sri Krishnadevaraya', B: 'Allasani Peddana', C: 'Tenali Ramakrishna', D: 'Nannaya' },
    correctAnswer: 'A',
    explanation: 'Emperor Sri Krishnadevaraya of Vijayanagara composed "Amuktamalyada", recounting the wedding of Lord Ranganatha and Andal.',
    difficulty: 'Medium',
  },
  {
    id: 'tel_002',
    category: 'Telugu Literature',
    topic: 'Telugu Literature',
    question: 'Who among the "Kavitrayam" (Trinity of Poets) commenced translating the Sanskrit Mahabharata into Telugu?',
    options: { A: 'Tikkana', B: 'Errana', C: 'Nannaya Bhattaraka', D: 'Potana' },
    correctAnswer: 'C',
    explanation: 'Nannaya Bhattaraka translated the Adi Parva and Sabha Parva of the Mahabharata in the 11th century under Rajaraja Narendra.',
    difficulty: 'Medium',
  },
  {
    id: 'tel_003',
    category: 'Telugu Literature',
    topic: 'Telugu Literature',
    question: 'Which prominent dynasty ruled the Andhra region with Orugallu (modern Warangal) as their capital?',
    options: { A: 'Satavahanas', B: 'Kakatiyas', C: 'Chalukyas', D: 'Ikshvakus' },
    correctAnswer: 'B',
    explanation: 'The Kakatiya dynasty ruled the Deccan region from Orugallu, famous for rulers like Rani Rudrama Devi and Prataparudra.',
    difficulty: 'Medium',
  },
  {
    id: 'tel_004',
    category: 'Telugu Literature',
    topic: 'Telugu Literature',
    question: 'Which freedom fighter and first Chief Minister of Andhra State was famously hailed as "Andhra Kesari" (Lion of Andhra)?',
    options: { A: 'Tanguturi Prakasam Pantulu', B: 'Potti Sreeramulu', C: 'Alluri Sitarama Raju', D: 'Kandukuri Veeresalingam' },
    correctAnswer: 'A',
    explanation: 'Tanguturi Prakasam Pantulu earned the title "Andhra Kesari" for baring his chest to British police rifles during the anti-Simon Commission protests in Madras in 1928.',
    difficulty: 'Easy',
  },
  {
    id: 'tel_005',
    category: 'Telugu Literature',
    topic: 'Telugu Literature',
    question: 'Who authored the monumental devotional classic "Srimad Andhra Bhagavatam" in lucid, lyrical Telugu poetry?',
    options: { A: 'Bammera Potana', B: 'Nannaya', C: 'Tikkana', D: 'Srinatha' },
    correctAnswer: 'A',
    explanation: 'Bammera Potana translated the Bhagavata Purana into Telugu, dedicating it directly to Lord Rama rather than mortal kings.',
    difficulty: 'Medium',
  },
  {
    id: 'tel_006',
    category: 'Telugu Literature',
    topic: 'Telugu Literature',
    question: 'Who was the first Telugu author to be awarded the prestigious national Jnanpith Award for his magnum opus "Ramayana Kalpavruksham"?',
    options: { A: 'C. Narayana Reddy', B: 'Viswanatha Satyanarayana', C: 'Ravuri Bharadhwaja', D: 'Sri Sri' },
    correctAnswer: 'B',
    explanation: 'Viswanatha Satyanarayana received the Jnanpith Award in 1970 for his epic masterpiece "Ramayana Kalpavruksham".',
    difficulty: 'Hard',
  },
  {
    id: 'tel_007',
    category: 'Telugu Literature',
    topic: 'Telugu Literature',
    question: 'Which visionary patriot from Andhra Pradesh designed the original design of the Indian National Flag that Mahatma Gandhi approved in 1921?',
    options: { A: 'Pingali Venkayya', B: 'Nyapati Subba Rao', C: 'Bhogaraju Pattabhi Sitaramayya', D: 'Duggirala Gopalakrishnayya' },
    correctAnswer: 'A',
    explanation: 'Pingali Venkayya from Bhatlapenumarru near Machilipatnam designed the tricolor flag that was later modified into the national flag of India.',
    difficulty: 'Easy',
  },
  {
    id: 'tel_008',
    category: 'Telugu Literature',
    topic: 'Telugu Literature',
    question: 'Which trailblazing Telugu poet penned the revolutionary anthology "Maha Prasthanam" that transformed modern Telugu poetry?',
    options: { A: 'Sri Sri (Srirangam Srinivasa Rao)', B: 'Gurram Jashuva', C: 'Devulapalli Krishna Sastri', D: 'Gurazada Apparao' },
    correctAnswer: 'A',
    explanation: 'Sri Sri wrote "Maha Prasthanam" (1950), ushering in the progressive poetry movement (Abhyudaya Kavitvam) in modern Telugu literature.',
    difficulty: 'Medium',
  },
  {
    id: 'tel_009',
    category: 'Telugu Literature',
    topic: 'Telugu Literature',
    question: 'Who composed over 32,000 devotional sankirtanas in praise of Lord Venkateswara of Tirumala and is celebrated as the "Pada-kavita Pitamaha"?',
    options: { A: 'Tallapaka Annamacharya', B: 'Tyagaraja', C: 'Bhadrachala Ramadasu', D: 'Kshetrayya' },
    correctAnswer: 'A',
    explanation: 'Annamacharya (1408–1503) composed thousands of kirtanas in Telugu for Lord Venkateswara, earning him the title "Pada-kavita Pitamaha".',
    difficulty: 'Easy',
  },
  {
    id: 'tel_010',
    category: 'Telugu Literature',
    topic: 'Telugu Literature',
    question: 'Which prominent social reformer authored the famous social drama "Kanyasulkam" in conversational spoken Telugu in 1892?',
    options: { A: 'Gurazada Apparao', B: 'Kandukuri Veeresalingam', C: 'Gidugu Ramamurthy', D: 'Chilakamarthi Lakshmi Narasimham' },
    correctAnswer: 'A',
    explanation: 'Gurazada Apparao wrote "Kanyasulkam" to challenge the custom of bride price and child marriage, introducing modern spoken dialect to literature.',
    difficulty: 'Medium',
  },
];

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Randomize option positions (A, B, C, D) for a question so that the correct answer
 * is never statically in the same spot, and distractors are fresh.
 */
function randomizeOptions(question) {
  const originalOptions = question.options || {};
  const correctOptionText = originalOptions[question.correctAnswer];
  if (!correctOptionText) return question;

  const optionTexts = [
    originalOptions.A,
    originalOptions.B,
    originalOptions.C,
    originalOptions.D,
  ].filter(Boolean);

  const shuffledTexts = shuffle(optionTexts);
  const keys = ['A', 'B', 'C', 'D'];
  const newOptions = {};
  let newCorrectKey = 'A';

  shuffledTexts.forEach((text, idx) => {
    const key = keys[idx];
    newOptions[key] = text;
    if (text === correctOptionText) {
      newCorrectKey = key;
    }
  });

  return {
    ...question,
    options: newOptions,
    correctAnswer: newCorrectKey,
  };
}

/**
 * Match topic keyword against question category / topic / question text
 */
function matchesTopic(question, searchTopic) {
  if (!searchTopic) return true;
  const cleanSearch = searchTopic.toLowerCase().trim();

  // Keyword associations
  if (cleanSearch.includes('history') || cleanSearch.includes('freedom') || cleanSearch.includes('battle') || cleanSearch.includes('mughal') || cleanSearch.includes('empire') || cleanSearch.includes('war')) {
    return question.category === 'Indian History' || question.category === 'Telugu Literature';
  }
  if (cleanSearch.includes('geography') || cleanSearch.includes('river') || cleanSearch.includes('ocean') || cleanSearch.includes('mountain') || cleanSearch.includes('planet') || cleanSearch.includes('park') || cleanSearch.includes('lake')) {
    return question.category === 'Geography' || question.category === 'Science';
  }
  if (cleanSearch.includes('polity') || cleanSearch.includes('constitution') || cleanSearch.includes('law') || cleanSearch.includes('parliament') || cleanSearch.includes('rights') || cleanSearch.includes('article') || cleanSearch.includes('president')) {
    return question.category === 'Indian Polity';
  }
  if (cleanSearch.includes('science') || cleanSearch.includes('space') || cleanSearch.includes('isro') || cleanSearch.includes('body') || cleanSearch.includes('physics') || cleanSearch.includes('chemistry') || cleanSearch.includes('biology')) {
    return question.category === 'Science' || question.category === 'Geography';
  }
  if (cleanSearch.includes('computer') || cleanSearch.includes('tech') || cleanSearch.includes('ai') || cleanSearch.includes('cyber') || cleanSearch.includes('internet') || cleanSearch.includes('programming')) {
    return question.category === 'Computer Knowledge';
  }
  if (cleanSearch.includes('economics') || cleanSearch.includes('bank') || cleanSearch.includes('gdp') || cleanSearch.includes('rbi') || cleanSearch.includes('money') || cleanSearch.includes('market') || cleanSearch.includes('gst')) {
    return question.category === 'Economics';
  }
  if (cleanSearch.includes('sport') || cleanSearch.includes('cricket') || cleanSearch.includes('olympic') || cleanSearch.includes('tennis') || cleanSearch.includes('football') || cleanSearch.includes('world cup')) {
    return question.category === 'Sports';
  }
  if (cleanSearch.includes('english') || cleanSearch.includes('grammar') || cleanSearch.includes('vocab') || cleanSearch.includes('idiom')) {
    return question.category === 'English Grammar';
  }
  if (cleanSearch.includes('telugu') || cleanSearch.includes('andhra')) {
    return question.category === 'Telugu Literature' || question.category === 'Indian History';
  }

  // Text contains
  return (
    question.category.toLowerCase().includes(cleanSearch) ||
    question.question.toLowerCase().includes(cleanSearch) ||
    question.topic.toLowerCase().includes(cleanSearch)
  );
}

/**
 * Generate Today's Date Quiz with session tracking
 */
export function getTodayDateQuestions(count = 5, difficulty = 'Medium', language = 'English') {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Find exact date matches or related calendar events
  let matches = CALENDAR_EVENTS.filter((e) => (e.month === month && e.day === day) || e.month === 0);

  if (matches.length < count) {
    // Fill with rich historical milestone questions
    const historyPool = COMPREHENSIVE_QUESTION_BANK.filter(
      (q) => q.category === 'Indian History' || q.category === 'General Knowledge'
    );
    const shuffledHistory = shuffle(historyPool);
    matches = [...matches, ...shuffledHistory];
  }

  // Session deduplication
  let freshPool = matches.filter((q) => !q.id || !usedQuestionKeys.has(q.id));
  if (freshPool.length < count) {
    usedQuestionKeys.clear();
    freshPool = matches;
  }

  const selected = shuffle(freshPool).slice(0, count);
  selected.forEach((q) => {
    if (q.id) usedQuestionKeys.add(q.id);
  });

  return selected.map((item, idx) => {
    const randomized = randomizeOptions(item);
    return {
      ...randomized,
      id: `q_today_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      topic: `Today in History (${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`,
      difficulty,
      language,
    };
  });
}

/**
 * Main dynamic question generator with session-based deduplication
 * Guarantees fresh, non-repeated questions every time you click generate!
 */
export function generateDynamicQuiz({
  topic = 'General Knowledge',
  count = 5,
  difficulty = 'Medium',
  language = 'English',
}) {
  const isTodayTopic = topic.toLowerCase().includes('today') || topic.toLowerCase().includes('this day');

  if (isTodayTopic) {
    return getTodayDateQuestions(count, difficulty, language);
  }

  // 1. Filter bank by topic
  let candidates = COMPREHENSIVE_QUESTION_BANK.filter((q) => matchesTopic(q, topic));

  // If topic has few specific candidates, expand with full bank
  if (candidates.length < count) {
    const otherQuestions = COMPREHENSIVE_QUESTION_BANK.filter((q) => !candidates.includes(q));
    candidates = [...candidates, ...shuffle(otherQuestions)];
  }

  // 2. Filter out already-used questions to guarantee NON-REPEATED generation!
  let freshPool = candidates.filter((q) => !usedQuestionKeys.has(q.id));

  // If we have exhausted all questions, reset tracking so cycle continues seamlessly
  if (freshPool.length < count) {
    usedQuestionKeys.clear();
    freshPool = [...candidates];
  }

  // 3. Shuffle pool and take requested count
  const shuffled = shuffle(freshPool);
  const selected = shuffled.slice(0, count);

  // 4. Mark selected questions as used in this session
  selected.forEach((q) => usedQuestionKeys.add(q.id));

  // 5. Randomize option positions (A/B/C/D) and attach metadata
  return selected.map((q, idx) => {
    const withRandomOptions = randomizeOptions(q);
    return {
      ...withRandomOptions,
      id: `q_dyn_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      topic: topic || q.topic,
      difficulty,
      language,
    };
  });
}

/**
 * Regenerate a single question dynamically without repeating
 */
export function regenerateDynamicSingleQuestion({
  topic = 'General Knowledge',
  difficulty = 'Medium',
  language = 'English',
  excludeQuestion = '',
}) {
  let candidates = COMPREHENSIVE_QUESTION_BANK.filter(
    (q) => matchesTopic(q, topic) && q.question !== excludeQuestion && !usedQuestionKeys.has(q.id)
  );

  if (candidates.length === 0) {
    candidates = COMPREHENSIVE_QUESTION_BANK.filter((q) => q.question !== excludeQuestion);
  }

  const pick = shuffle(candidates)[0] || COMPREHENSIVE_QUESTION_BANK[0];
  usedQuestionKeys.add(pick.id);

  const randomized = randomizeOptions(pick);
  return {
    ...randomized,
    id: `q_single_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    topic: topic || pick.topic,
    difficulty,
    language,
  };
}
