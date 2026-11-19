import re


def clean_skills(skills):
    """Convert comma-separated skills into a clean list."""

    if not skills:
        return []

    skill_list = re.split(r"[,;\n]", skills)

    return list(dict.fromkeys(
        skill.strip().casefold()
        for skill in skill_list
        if skill.strip()
    ))


def calculate_skill_match(profile, opportunity):
    """Compare applicant skills with employer-required skills."""

    applicant_skills = clean_skills(profile.skills)

    required_skills = clean_skills(opportunity.required_skills)

    matched_skills = [
        skill for skill in required_skills
        if skill in applicant_skills
    ]

    missing_skills = [
        skill for skill in required_skills
        if skill not in applicant_skills
    ]

    if not required_skills:
        score = 0
    else:
        score = (
            len(matched_skills) / len(required_skills)
        ) * 100

    return {
        "match_score": round(score, 2),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
    }