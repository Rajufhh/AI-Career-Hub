import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
export async function POST(request) {
  try {
    const { coverLetter, companyName, jobPosition } = await request.json();
    if (!coverLetter) {
      return NextResponse.json(
        { error: "No cover letter content provided" },
        { status: 400 }
      );
    }

    // Extract name from the cover letter text
    // The name is typically the first line of the cover letter
    const lines = coverLetter.trim().split("\n");
    const extractedName = lines[0].trim();

    // Current date
    const date = new Date();
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    // Process the cover letter content to maintain proper paragraph formatting
    // Ensure no duplicate footers in the content
    const cleanedContent = coverLetter.replace(
      /Page \d+ of \d+, Updated .+$/gm,
      ""
    );
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
    // Add header with the extracted name
    doc.setFontSize(24);
    doc.text(extractedName || "Applicant Name", pageWidth / 2, y, {
      align: "center",
    });
    y += 10;
    // Add job position
    doc.setFontSize(16);
    doc.setTextColor(32, 64, 151); // RGB for #204097
    doc.text(
      `For: ${jobPosition || "Position at " + companyName}`,
      pageWidth / 2,
      y,
      { align: "center" }
    );
    y += 10;
    // Add divider
    doc.setDrawColor(32, 64, 151); // RGB for #204097
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
    // Add title
    doc.setFontSize(18);
    doc.text("COVER LETTER", pageWidth / 2, y, { align: "center" });
    y += 15;
    // Reset text color for content
    doc.setTextColor(51, 51, 51); // #333333
    doc.setFontSize(11);
    // Process paragraphs
    const paragraphs = cleanedContent.split("\n\n");

    for (const paragraph of paragraphs) {
      // Skip empty paragraphs
      if (!paragraph.trim()) continue;

      // Split the text to fit within page width
      const lines = doc.splitTextToSize(paragraph.trim(), contentWidth);

      // Check if we need a new page
      if (y + lines.length * 5 > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage();
        y = 20;
      }

      // Add the paragraph
      doc.text(lines, margin, y);
      y += lines.length * 5 + 5; // Add space after paragraph
    }
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(179, 179, 179); // #b3b3b3
    doc.text(
      `Page 1 of 1, Updated ${formattedDate}`,
      pageWidth - margin,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
    // Get the PDF as buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Cover_Letter_${companyName.replace(
          /\s+/g,
          "_"
        )}.pdf"`,
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
