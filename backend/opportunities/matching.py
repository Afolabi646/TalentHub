import re


STOP_WORDS = {
    "the", "and", "or", "for", "with", "a", "an", "to",
    "of", "in", "on", "at", "is", "are", "be", "as",
    "by", "from", "that", "this", "will", "have", "has",
    "you", "your", "we", "our", "who", "can", "must",
}


def tokenize(text):
    """Convert text into useful lowercase keywords."""
    words = re.findall(r"[a-zA-Z0-9+#.]+", text.lower())

    return {
        word for word in words
        if word not in STOP_WORDS and len(word) > 1
    }


def calculate_match_score(profile, opportunity):
    """Give applicant skills more weight when matching opportunities."""

    skills_words = tokenize(profile.skills or "")

    experience_words = tokenize(profile.experience or "")

    bio_words = tokenize(profile.bio or "")

    opportunity_text = " ".join([
        opportunity.title or "",
        opportunity.description or "",
        opportunity.eligibility or "",
    ])

    opportunity_words = tokenize(opportunity_text)

    if not opportunity_words:
        return 0

    if not skills_words and not experience_words and not bio_words:
        return 0

    # Skills carry the most weight.
    weighted_matches = (
        len(skills_words.intersection(opportunity_words)) * 3
        + len(experience_words.intersection(opportunity_words)) * 2
        + len(bio_words.intersection(opportunity_words))
    )

    total_weight = (
        len(opportunity_words) * 3
    )

    score = (weighted_matches / total_weight) * 100

    return round(min(score, 100), 2)