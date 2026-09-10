export const formatPersonDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(`${value}T00:00:00Z`);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
};

export const getPersonCredits = (credits = {}) => {
  const titles = new Map();

  const addCredit = (credit, role) => {
    if (
      !credit.id ||
      !["movie", "tv"].includes(credit.media_type)
    ) {
      return;
    }

    const key = `${credit.media_type}-${credit.id}`;

    if (!titles.has(key)) {
      titles.set(key, {
        key,
        id: credit.id,
        mediaType: credit.media_type,
        title: credit.title || credit.name || "Untitled",
        date: credit.release_date || credit.first_air_date || "",
        posterPath: credit.poster_path,
        roles: [],
      });
    }

    const title = titles.get(key);

    if (role && !title.roles.includes(role)) {
      title.roles.push(role);
    }
  };

  for (const credit of credits.cast ?? []) {
    addCredit(credit, credit.character || "Acting");
  }

  for (const credit of credits.crew ?? []) {
    addCredit(credit, credit.job || credit.department || "Crew");
  }

  return Array.from(titles.values()).sort(
    (first, second) =>
      second.date.localeCompare(first.date) ||
      first.title.localeCompare(second.title),
  );
};

export const getPersonLinks = (person) => {
  const ids = person.external_ids ?? {};

  const sources = [
    ["IMDb", ids.imdb_id || person.imdb_id, "https://www.imdb.com/name/"],
    ["Instagram", ids.instagram_id, "https://www.instagram.com/"],
    ["Facebook", ids.facebook_id, "https://www.facebook.com/"],
    ["X", ids.twitter_id, "https://x.com/"],
    ["TikTok", ids.tiktok_id, "https://www.tiktok.com/@"],
    ["YouTube", ids.youtube_id, "https://www.youtube.com/channel/"],
    ["Wikidata", ids.wikidata_id, "https://www.wikidata.org/wiki/"],
  ];

  const links = sources
    .filter(([, id]) => typeof id === "string" && id.trim())
    .map(([label, id, base]) => ({
      label,
      href: `${base}${encodeURIComponent(id.trim())}`,
    }));

  if (person.homepage) {
    try {
      const url = new URL(person.homepage);

      if (["https:", "http:"].includes(url.protocol)) {
        links.unshift({
          label: "Official website",
          href: url.href,
        });
      }
    } catch {
      // Invalid external URLs are omitted.
    }
  }

  return links;
};