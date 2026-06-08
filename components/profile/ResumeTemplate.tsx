import {
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ResumeContent } from "@/types";

const styles = StyleSheet.create({
  page: {
    padding: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 14,
    textAlign: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  contactLine: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 2,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#2a2a2a",
    marginBottom: 1,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    marginBottom: 6,
  },
  body: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  skillText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  experienceItem: {
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 1,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: "bold",
  },
  jobDates: {
    fontSize: 10,
    color: "#555555",
  },
  company: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#444444",
    marginBottom: 3,
  },
  bullet: {
    fontSize: 10,
    lineHeight: 1.5,
    marginLeft: 14,
    marginBottom: 1,
  },
  educationText: {
    fontSize: 10,
    lineHeight: 1.5,
    fontWeight: "bold",
  },
});

type Props = {
  content: ResumeContent;
};

export function ResumeTemplate({ content }: Props) {
  const contactParts = [
    content.contactInfo.email,
    content.contactInfo.phone,
    content.contactInfo.location,
  ].filter(Boolean);

  const linkParts = [
    content.contactInfo.linkedinUrl,
    content.contactInfo.portfolioUrl,
  ].filter(Boolean);

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
          {content.contactInfo.fullName && (
            <Text style={styles.name}>{content.contactInfo.fullName}</Text>
          )}
          {contactParts.length > 0 && (
            <Text style={styles.contactLine}>{contactParts.join(" | ")}</Text>
          )}
          {linkParts.length > 0 && (
            <Text style={styles.contactLine}>{linkParts.join(" | ")}</Text>
          )}
        </View>

        {content.professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <View style={styles.divider} />
            <Text style={styles.body}>{content.professionalSummary}</Text>
          </View>
        )}

        {content.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.divider} />
            <Text style={styles.skillText}>{content.skills.join(", ")}</Text>
          </View>
        )}

        {content.workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            <View style={styles.divider} />
            {content.workExperience.map((exp, i) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <Text style={styles.jobDates}>{exp.dates}</Text>
                </View>
                <Text style={styles.company}>{exp.company}</Text>
                {exp.bullets.map((bullet, j) => (
                  <Text key={j} style={styles.bullet}>
                    {"\u2022"} {bullet}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {(content.education.degree || content.education.institution) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.divider} />
            <Text style={styles.educationText}>
              {[
                content.education.degree,
                content.education.field,
                content.education.institution,
                content.education.year,
              ]
                .filter(Boolean)
                .join(" — ")}
            </Text>
          </View>
        )}
      </Page>
  );
}
