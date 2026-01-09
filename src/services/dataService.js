import Papa from 'papaparse';
import { parse, format } from 'date-fns';

const SCORES_CSV_URL = 'https://docs.google.com/spreadsheets/d/1uQmAEAD2BIuc_eEMCKjM7ynH3p2nVqiS_5XbvlvVj-w/export?format=csv&gid=603308068';
const CONTESTANTS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1uQmAEAD2BIuc_eEMCKjM7ynH3p2nVqiS_5XbvlvVj-w/export?format=csv&gid=1205107889';

export async function fetchData() {
  try {
    const [scoresResponse, contestantsResponse] = await Promise.all([
      fetch(SCORES_CSV_URL),
      fetch(CONTESTANTS_CSV_URL)
    ]);

    const scoresText = await scoresResponse.text();
    const contestantsText = await contestantsResponse.text();

    const scoresData = Papa.parse(scoresText, { header: true, skipEmptyLines: true }).data;
    const contestantsData = Papa.parse(contestantsText, { header: true, skipEmptyLines: true }).data;

    // Join datasets
    const contestantsMap = {};

    // Process contestants first
    contestantsData.forEach(c => {
      const name = c['Name'];
      if (name) {
        // Prepend /images/ if a filename is provided, otherwise use placeholder
        const baseUrl = import.meta.env.BASE_URL;
        let imagePath = `${baseUrl}images/placeholder.svg`;
        if (c['Profile Picture']) {
           imagePath = `${baseUrl}images/${c['Profile Picture']}`;
        }

        contestantsMap[name] = {
          name: name,
          image: imagePath,
          totalPoints: 0,
          totalDogs: 0,
          creativePoints: 0,
          history: []
        };
      }
    });

    // Process scores
    scoresData.forEach(s => {
      const name = s['Contestant'];
      const dogPoints = parseFloat(s['Dog Points']) || 0;
      const creativePoints = parseFloat(s['Creative Points']) || 0;
      const totalPoints = parseFloat(s['Total Points']) || (dogPoints + creativePoints);
      const date = s['Date'];

      if (contestantsMap[name]) {
        contestantsMap[name].totalPoints += totalPoints;
        contestantsMap[name].totalDogs += dogPoints;
        contestantsMap[name].creativePoints += creativePoints;
        contestantsMap[name].history.push({
          date: date,
          dogPoints: dogPoints,
          creativePoints: creativePoints,
          totalPoints: totalPoints
        });
      } else {
        console.warn(`Contestant "${name}" found in scores but not in contestants list. Skipping.`);
      }
    });

    // Calculate derived stats and format history
    const contestants = Object.values(contestantsMap).map(c => {
      // Sort history by date descending
      c.history.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Calculate funny stats
      // 1 Hot Dog ~ 300 Cal
      c.calories = c.totalDogs * 300;

      // 1 Hot Dog ~ 0.1 lbs
      c.weightLbs = (c.totalDogs * 0.1).toFixed(1);

      // Height of Eiffel Tower (12,960 inches = 2160 dogs)
      const dogsToEiffel = 2160;
      const eiffelVal = (c.totalDogs / dogsToEiffel).toFixed(4);
      c.eiffelSentence = `${c.name} has eaten enough dogs to stack ${eiffelVal} Eiffel Towers high!`;

      // Weight of a Large Pizza ~ 2 lbs (20 dogs)
      const pizzaWeight = (c.totalDogs * 0.1) / 2;
      c.pizzaSentence = `That's roughly equivalent to the weight of ${pizzaWeight.toFixed(1)} large pepperonis!`;

      // Ninja Power (Arbitrary: 1 dog powers a ninja for 10 minutes)
      const ninjaMinutes = c.totalDogs * 10;
      c.ninjaSentence = `Enough fuel to power a ninja fighting foot soldiers for ${ninjaMinutes} minutes!`;

      // Manhole Covers (Diameter ~ 24 inches = 4 dogs)
      const manholeCovers = (c.totalDogs / 4).toFixed(1);
      c.manholeSentence = `Laid end-to-end, they'd span across ${manholeCovers} sewer manhole covers!`;

      return c;
    });

    // Sort contestants by total points descending
    contestants.sort((a, b) => b.totalPoints - a.totalPoints);

    // Get recent activity (flat list of all score entries)
    const recentActivity = [];
    scoresData.forEach(s => {
       recentActivity.push({
         name: s['Contestant'],
         date: s['Date'],
         dogPoints: s['Dog Points'],
         totalPoints: s['Total Points']
       });
    });
    // Sort recent activity by date descending and take top 10
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recent10 = recentActivity.slice(0, 10);

    // Calculate Highlights
    let biggestDrop = { points: -1 };

    scoresData.forEach(s => {
      const name = s['Contestant'];
      const date = s['Date'];
      const dogPoints = parseFloat(s['Dog Points']) || 0;
      const creativePoints = parseFloat(s['Creative Points']) || 0;
      const totalPoints = parseFloat(s['Total Points']) || (dogPoints + creativePoints);

      // Biggest Score Drop (Total Points)
      if (totalPoints > biggestDrop.points) {
        biggestDrop = { name, date, points: totalPoints };
      }
    });

    // Most Creative (Total Creative Points)
    let maxCreative = -1;
    contestants.forEach(c => {
        if (c.creativePoints > maxCreative) maxCreative = c.creativePoints;
    });

    const creativeWinners = contestants
        .filter(c => c.creativePoints === maxCreative && maxCreative > 0)
        .map(c => c.name);

    let creativeText = '';
    if (creativeWinners.length === 0) {
        creativeText = 'No creative points awarded yet!';
    } else if (creativeWinners.length === 1) {
        creativeText = `${creativeWinners[0]} has earned ${maxCreative} total creative points!`;
    } else {
        const names = [...creativeWinners];
        if (names.length === 2) {
            creativeText = `${names[0]} & ${names[1]} are tied for the most creative points with ${maxCreative}!`;
        } else {
            const last = names.pop();
            creativeText = `${names.join(', ')}, & ${last} are tied for the most creative points with ${maxCreative}!`;
        }
    }

    // Glizzy Gladiator (Total Dog Points)
    let maxDogs = -1;
    contestants.forEach(c => {
        if (c.totalDogs > maxDogs) maxDogs = c.totalDogs;
    });

    const glizzyWinners = contestants
        .filter(c => c.totalDogs === maxDogs && maxDogs > 0)
        .map(c => c.name);

    let glizzyText = '';
    if (glizzyWinners.length === 0) {
        glizzyText = 'No dogs eaten yet!';
    } else if (glizzyWinners.length === 1) {
        glizzyText = `${glizzyWinners[0]} has consumed a total of ${maxDogs} dogs!`;
    } else {
        const names = [...glizzyWinners];
        if (names.length === 2) {
            glizzyText = `${names[0]} & ${names[1]} are tied for the most dogs with ${maxDogs} consumed!`;
        } else {
            const last = names.pop();
            glizzyText = `${names.join(', ')}, & ${last} are tied for the most dogs with ${maxDogs} consumed!`;
        }
    }

    const highlights = [
      {
        title: "BIGGEST SCORE DROP 📉",
        text: `${biggestDrop.name} slammed down ${biggestDrop.points} points on ${biggestDrop.date}!`,
        icon: "💥"
      },
      {
        title: "MOST CREATIVE 🎨",
        text: creativeText,
        icon: "✨"
      },
      {
        title: "GLIZZY GLADIATOR 🌭",
        text: glizzyText,
        icon: "👑"
      }
    ];

    return {
      contestants,
      recentActivity: recent10,
      highlights
    };

  } catch (error) {
    console.error("Error fetching data:", error);
    return { contestants: [], recentActivity: [] };
  }
}
