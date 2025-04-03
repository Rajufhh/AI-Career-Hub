import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function POST(request) {
  try {
    const { results, selectedDomain } = await request.json();
    if (!results) {
      return NextResponse.json(
        { error: "No assessment results provided" },
        { status: 400 }
      );
    }

    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Page dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Set initial y position
    let y = 20;

    // Add header
    doc.setFontSize(24);
    doc.text("Career Assessment Results", pageWidth / 2, y, {
      align: "center",
    });
    y += 10;

    // Add domain
    doc.setFontSize(16);
    doc.setTextColor(227, 29, 101); // RGB for #E31D65
    doc.text(`Field: ${selectedDomain}`, pageWidth / 2, y, { align: "center" });
    y += 10;

    // Add divider
    doc.setDrawColor(227, 29, 101); // RGB for #E31D65
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    // Reset text color for content
    doc.setTextColor(51, 51, 51); // #333333

    // Add summary
    doc.setFontSize(14);
    doc.text("Summary", margin, y);
    y += 8;
    doc.setFontSize(11);
    const summaryLines = doc.splitTextToSize(results.summary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 10;

    // Add strengths
    doc.setFontSize(14);
    doc.text("Your Strengths", margin, y);
    y += 8;
    doc.setFontSize(11);
    for (const strength of results.strengths) {
      // Check if we need a new page
      if (y > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        y = 20;
      }

      const strengthLines = doc.splitTextToSize(`• ${strength}`, contentWidth);
      doc.text(strengthLines, margin, y);
      y += strengthLines.length * 5 + 3;
    }
    y += 5;

    // Add career paths
    doc.setFontSize(14);
    doc.text("Potential Career Paths", margin, y);
    y += 8;
    doc.setFontSize(11);
    for (const path of results.careerPaths) {
      // Check if we need a new page
      if (y > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        y = 20;
      }

      const pathLines = doc.splitTextToSize(`• ${path}`, contentWidth);
      doc.text(pathLines, margin, y);
      y += pathLines.length * 5 + 3;
    }
    y += 5;

    // Add detailed analysis
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.text("Detailed Analysis", margin, y);
    y += 8;
    doc.setFontSize(11);

    const categories = [
      "Aptitude & Interests",
      "Core Competencies",
      "Values & Priorities",
      "Self-Perception",
      "Personality Traits",
    ];

    for (let i = 0; i < results.detailedAnalysis.length; i++) {
      // Check if we need a new page
      if (y > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);
      doc.setTextColor(227, 29, 101); // RGB for #E31D65
      doc.text(categories[i] || `Section ${i + 1}`, margin, y);
      y += 6;

      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51); // #333333
      const analysisLines = doc.splitTextToSize(
        results.detailedAnalysis[i],
        contentWidth
      );
      doc.text(analysisLines, margin, y);
      y += analysisLines.length * 5 + 8;
    }

    // Add next steps
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.text("Recommended Next Steps", margin, y);
    y += 8;
    doc.setFontSize(11);
    for (let i = 0; i < results.nextSteps.length; i++) {
      // Check if we need a new page
      if (y > doc.internal.pageSize.getHeight() - 30) {
        doc.addPage();
        y = 20;
      }

      const stepLines = doc.splitTextToSize(
        `${i + 1}. ${results.nextSteps[i]}`,
        contentWidth
      );
      doc.text(stepLines, margin, y);
      y += stepLines.length * 5 + 3;
    }

    // Current date for footer
    const date = new Date();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    // Add footer on each page
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(179, 179, 179); // #b3b3b3
      doc.text(
        `Page ${i} of ${pageCount}, Generated ${formattedDate}`,
        pageWidth - margin,
        doc.internal.pageSize.getHeight() - 10,
        { align: "right" }
      );
    }

    // Get the PDF as buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Career_Assessment_Results.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "An error occurred while generating the PDF: " + error.message },
      { status: 500 }
    );
  }
}
