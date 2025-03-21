import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { 
        padding: 20, 
        backgroundColor: '#FFFFFF',
        flexDirection: 'column'
    },
    section: { 
        marginBottom: 10, 
        padding: 10 
    },
    title: { 
        fontSize: 18, 
        textAlign: 'center', 
        marginBottom: 10 
    },
    image: { 
        width: 180,     // Smaller size for two-column layout
        height: 150, 
        marginBottom: 10 
    },
    chartContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: 15 
    },
    chartItem: {
        width: '45%',   // Ensures two columns
        textAlign: 'center',
        marginBottom: 15
    },
    chartTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5
    },
    placeholderBox: {
        width: 180,
        height: 150,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 10,
        marginBottom: 10
    },
    largePlaceholderBox: {
        width: 400,
        height: 100,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 10,
        marginVertical: 10
    },
    certificatePlaceholderBox: {
        width: 400,
        height: 200,
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 10,
        marginVertical: 10
    },
    logoPlaceholderBox: {
        width: 100,
        height: 70,
        margin: 'auto',
        backgroundColor: '#f0f0f0',
        borderWidth: 1,
        borderColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 5
    },
    placeholderText: {
        fontSize: 10
    },
    largePlaceholderText: {
        fontSize: 12
    },
    t3: { fontSize: 13, textAlign: 'left', marginBottom: 8 },
    t5: { fontSize: 13, textAlign: 'left', marginBottom: 8 },
    t4: { fontSize: 13, textAlign: 'left', marginLeft: 30 },
    t2: { fontSize: 12, textAlign: 'center', marginBottom: 10 },
    chartImage: { 
        width: 460, 
        height: 'auto',
        maxHeight: 450, 
        objectFit: 'contain',
        marginVertical: 5,
        alignSelf: "center"
    },
    t1: { fontSize: 15, textAlign: 'center', marginBottom: 10, color: "red" },
    header: { textAlign: 'center', fontSize: 16, marginBottom: 10 },
    table: { display: 'table', width: '100%' },
    tableRow: { flexDirection: 'row' },
    tableCellHeader: { 
        flex: 1, 
        padding: 5, 
        borderWidth: 1, 
        borderColor: '#000', 
        borderStyle: 'solid', 
        backgroundColor: '#E4E4E4', 
        textAlign: 'center', 
        fontSize: 12 
    },
    tableCell: { 
        flex: 1, 
        padding: 5, 
        borderWidth: 1, 
        borderColor: '#000', 
        borderStyle: 'solid', 
        textAlign: 'center', 
        fontSize: 12 
    },
    img2: { width: 100, height: 70, alignSelf: 'center', marginBottom: 10 },
    img: { width: 400, height: 300, alignSelf: 'center', marginBottom: 10 },
    boldText: { fontSize: 13 },
    list: { marginTop: 5, paddingLeft: 20, fontSize: 13 },
    line: { borderBottomWidth: 1, borderBottomColor: '#000', width: '100%', marginVertical: 10 },
});

// Default faculty and students data
const defaultFaculty = [
    { name: 'Mr. Sachin Pande', role: 'Head – Professional Development Committee' },
    { name: 'Mrs. Amruta Patil', role: 'Member of PDA' },
    { name: 'Mr. ViniTribhuvan', role: 'Member of PDA' }
];
  
const defaultStudents = [
    'Rudraksh Khandelwal',
    'Mikhiel Benji',
    'Akshay Raut',
    'Om Patil'
]; 

// Try/catch wrapper for safe text display
const SafeText = ({ style, children }) => {
    try {
        return <Text style={style}>{children}</Text>;
    } catch (error) {
        console.error("Error rendering text:", error);
        return <Text style={style}>Error displaying content</Text>;
    }
};

const ReportPDAPDF = ({ data = {} }) => {
    // Extract data with fallbacks to prevent errors
    const {
        title = "Knowledge Assessment Quiz",
        targetAudience = "Students",
        date = new Date().toLocaleDateString(),
        time = "11:00 am to 12:00 pm",
        organizedBy = "Professional Development Activity Committee",
        committeeType = "Professional Development Activity Committee",
        institution = "Pune Institute of Computer Technology",
        venue = "Google Form",
        fee = "0",
        participants = "230",
        faculty = defaultFaculty,
        students = defaultStudents,
        objectives = [],
        execution = "",
        outcomes = [],
        impactAnalysis = [],
        feedback = [],
        chartImages = [],
        excelData = []
    } = data;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <SafeText style={styles.title}>A {'\n'} Report On </SafeText>
                    <SafeText style={styles.t1}> {title}</SafeText>
                    
                    <SafeText style={styles.title}>For{'\n'} {targetAudience} {'\n'}</SafeText>
                    <SafeText style={styles.title}>  On {'\n'} {date} {'\n'} </SafeText>

                    <SafeText style={styles.title}> Organised by</SafeText>
                    <View style={styles.logoPlaceholderBox}>
                        <SafeText style={styles.placeholderText}>[Organization Logo]</SafeText>
                    </View>
                    <SafeText style={styles.title}> {committeeType}</SafeText> 
                    <SafeText style={styles.title}>Society for Computer Technology and Research's {'\n'}
                    {institution} {'\n'} </SafeText>
                    <SafeText style={styles.t2}> Sr No. 27 Pune-Satara Road, Dhankawadi,{'\n'}
                    Pune, Maharashtra 411043. (www.pict.edu)</SafeText> 
                </View>
            </Page>

            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <SafeText style={styles.t5}>Report: </SafeText>
                    <SafeText style={styles.t3}>A knowledge assessment quiz '{title}' for {targetAudience} organized by {committeeType}, {institution}, Pune </SafeText>

                    <SafeText style={styles.t5}>To: </SafeText>
                    <SafeText style={styles.t3}>{targetAudience}, {institution}, Pune</SafeText>
                    
                    <SafeText style={styles.t5}>From: PDA Core team</SafeText>

                    <View style={styles.section}>
                        <SafeText style={styles.boldText}>Faculty Members:</SafeText>
                        {faculty.map((member, index) => (
                            <SafeText key={index} style={styles.list}>{index + 1}. {member.name || member}</SafeText>
                        ))}
                    </View>

                    <View style={styles.section}>
                        <SafeText style={styles.boldText}>Students:</SafeText>
                        {students.map((name, index) => (
                            <SafeText key={index} style={styles.list}>{index + 1}. {name}</SafeText>
                        ))}
                    </View>

                    <SafeText style={styles.t5}>Date and time of conduction: </SafeText>
                    <SafeText style={styles.t3}>Date: {date}</SafeText>
                    <SafeText style={styles.t3}>Time: {time}</SafeText>
                    <SafeText style={styles.t3}>Venue: {venue}</SafeText>
                    <SafeText style={styles.t3}>Fees: {fee}</SafeText>
                    <SafeText style={styles.t3}>Number of participants: {participants}</SafeText>
                    
                    <View style={{ marginTop: 10 }}>
                        <SafeText style={styles.t5}>Organized by:</SafeText>
                        {faculty.map((member, index) => (
                            <SafeText key={index} style={styles.t3}>
                                {member.name || member}{member.role ? `, ${member.role}` : ''}
                                {index === faculty.length - 1 ? '' : ','}
                            </SafeText>
                        ))}
                        <SafeText style={styles.t3}>Department of Information Technology, {institution}, Pune.</SafeText>
                    </View>
                </View>
            </Page>

            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <SafeText style={styles.t5}> Objectives: </SafeText>
                    {objectives && objectives.length > 0 ? (
                        objectives.map((objective, index) => (
                            <SafeText key={index} style={styles.t3}>{index + 1}. {objective}{'\n'}</SafeText>
                        ))
                    ) : (
                        <>
                            <SafeText style={styles.t3}>1. Foster a competitive yet supportive environment to encourage skill showcasing and mutual learning. {'\n'}</SafeText>
                            <SafeText style={styles.t3}>2. Assess participants' skills dynamically and challenge them in a lively quiz setting. {'\n'}</SafeText>
                            <SafeText style={styles.t3}>3. Facilitate in-depth domain knowledge acquisition essential for success in future internships and placements. {'\n'}</SafeText>
                        </>
                    )}

                    <SafeText style={styles.t5}> Execution: </SafeText>
                    <SafeText style={styles.t3}>{execution || "A knowledge assessment quiz to help students in placement and internship selection process, was held on the specified date. The quiz focused on data structures and algorithms."}</SafeText>

                    <SafeText style={styles.t5}> Outcomes: </SafeText>
                    {outcomes && outcomes.length > 0 ? (
                        outcomes.map((outcome, index) => (
                            <SafeText key={index} style={styles.t3}>{index + 1}. {outcome}{'\n'}</SafeText>
                        ))
                    ) : (
                        <>
                            <SafeText style={styles.t3}>1. Participants will demonstrate improved proficiency in the assessed skills, indicating growth and development in their knowledge areas. {'\n'}</SafeText>
                            <SafeText style={styles.t3}>2. Attendees will acquire a deeper understanding of the domain, enhancing their expertise and readiness for future internship and placement opportunities. {'\n'}</SafeText>
                            <SafeText style={styles.t3}>3. The top scorers will be honored with a special gift, fostering a sense of achievement and motivation among participants. {'\n'}</SafeText>
                        </>
                    )}
                </View>
            </Page>

            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <SafeText style={styles.t5}> Impact Analysis: </SafeText>
                    {impactAnalysis && impactAnalysis.length > 0 ? (
                        impactAnalysis.map((impact, index) => (
                            <SafeText key={index} style={styles.t3}>{index + 1}. {impact}{'\n'}</SafeText>
                        ))
                    ) : (
                        <>
                            <SafeText style={styles.t3}>1. Enhanced problem solving and critical thinking {'\n'}</SafeText>
                            <SafeText style={styles.t3}>2. Preparation for future tests for internships and placements{'\n'}</SafeText>
                            <SafeText style={styles.t3}>3. Increased awareness of knowledge gaps{'\n'}</SafeText>
                            <SafeText style={styles.t3}>4. Overall readiness for internships and placements {'\n'}</SafeText>
                        </>
                    )}

                    <SafeText style={styles.t5}> Team </SafeText>
                    <View style={styles.largePlaceholderBox}>
                        <SafeText style={styles.largePlaceholderText}>[Team Photo]</SafeText>
                    </View>
                    <SafeText style={styles.t5}> Winner </SafeText>
                    <View style={styles.largePlaceholderBox}>
                        <SafeText style={styles.largePlaceholderText}>[Winner Photo]</SafeText>
                    </View>
                </View>
            </Page>

            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <SafeText style={styles.t5}> Certificate: </SafeText>
                    <View style={styles.certificatePlaceholderBox}>
                        <SafeText style={styles.largePlaceholderText}>[Certificate Template]</SafeText>
                    </View>
                    <View style={styles.certificatePlaceholderBox}>
                        <SafeText style={styles.largePlaceholderText}>[Example Certificate]</SafeText>
                    </View>
                </View>
            </Page>

            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <SafeText style={styles.title}>Student Performance Analysis:</SafeText>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <SafeText style={styles.tableCellHeader}>Sr No</SafeText>
                            <SafeText style={styles.tableCellHeader}>Roll Number</SafeText>
                            <SafeText style={styles.tableCellHeader}>Name</SafeText>
                            <SafeText style={styles.tableCellHeader}>Marks</SafeText>
                        </View>
                        {excelData && excelData.length > 0 ? (
                            excelData.map((row, index) => (
                                <View style={styles.tableRow} key={index}>
                                    <SafeText style={styles.tableCell}>{row['Sr No']}</SafeText>
                                    <SafeText style={styles.tableCell}>{row['Roll Number']}</SafeText>
                                    <SafeText style={styles.tableCell}>{row['Name']}</SafeText>
                                    <SafeText style={styles.tableCell}>{row['Marks']}</SafeText>
                                </View>
                            ))
                        ) : (
                            // Dummy data if no excelData is provided
                            Array.from({ length: 10 }, (_, i) => (
                                <View style={styles.tableRow} key={i}>
                                    <SafeText style={styles.tableCell}>{i + 1}</SafeText>
                                    <SafeText style={styles.tableCell}>{`IT_${20000 + i}`}</SafeText>
                                    <SafeText style={styles.tableCell}>{`Student ${i + 1}`}</SafeText>
                                    <SafeText style={styles.tableCell}>{Math.floor(Math.random() * 50) + 50}</SafeText>
                                </View>
                            ))
                        )}
                    </View>
                </View>
            </Page>

            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <SafeText style={styles.title}>Feedback Analysis Report</SafeText>

                    {chartImages && chartImages.length > 0 ? (
                        chartImages.map((img, index) => (
                            <View key={index} style={{ marginBottom: 20 }}>
                                <SafeText style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>
                                    {img.title}
                                </SafeText>
                                {img.src ? (
                                    <Image src={img.src} style={styles.chartImage} />
                                ) : (
                                    <View style={styles.placeholderBox}>
                                        <SafeText style={styles.placeholderText}>[Chart Image: {img.title}]</SafeText>
                                    </View>
                                )}
                            </View>
                        ))
                    ) : (
                        <View style={styles.section}>
                            <SafeText style={{ fontSize: 12, textAlign: 'center' }}>
                                No feedback charts available. Please upload feedback data to generate charts.
                            </SafeText>
                        </View>
                    )}
                </View>
            </Page>

            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <SafeText style={styles.t5}> Descriptive Feedback </SafeText>
                    {feedback && feedback.length > 0 ? (
                        feedback.map((item, index) => (
                            <SafeText key={index} style={styles.t3}>{index + 1}. {item}{'\n'}</SafeText>
                        ))
                    ) : (
                        <>
                            <SafeText style={styles.t3}>1. This test was really helpful for our Placement preparation {'\n'}</SafeText>
                            <SafeText style={styles.t3}>2. Very good quality questions!{'\n'}</SafeText>
                            <SafeText style={styles.t3}>3. Great experience{'\n'}</SafeText>
                            <SafeText style={styles.t3}>4. Keep taking similar quizes {'\n'}</SafeText>
                            <SafeText style={styles.t3}>5. Quiz level was medium and excellent quality of questions. {'\n'}</SafeText>
                            <SafeText style={styles.t3}>6. Quiz is good but its too lengthy{'\n'}</SafeText>
                            <SafeText style={styles.t3}>7. Best quiz ever!! {'\n'}</SafeText>
                        </>
                    )}
                </View>
            </Page>
        </Document>
    );
};

export default ReportPDAPDF; 