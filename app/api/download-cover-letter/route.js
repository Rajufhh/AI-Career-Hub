// app/api/download-cover-letter/route.js
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request) {
  try {
    const { coverLetter, companyName, jobPosition } = await request.json();

    if (!coverLetter) {
      return NextResponse.json(
        { error: "No cover letter content provided" },
        { status: 400 }
      );
    }

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

    const formattedCoverLetter = cleanedContent
      .split("\n")
      .map((line) =>
        line.trim() ? `<p style="margin: 0;">${line}</p>` : "<br>"
      )
      .join("");

    // Create HTML content for the PDF that resembles the LaTeX template
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Cover Letter</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap');
        
        body {
          font-family: 'Source Sans Pro', Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        
        .container {
          max-width: 21cm;
          margin: 0 auto;
          padding: 0 1cm;
          padding-bottom: 40px; /* Added space for footer */
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        
        .header-left {
          width: 24%;
          text-align: left;
        }
        
        .header-center {
          width: 50%;
          text-align: center;
        }
        
        .header-right {
          width: 24%;
          text-align: right;
        }
        
        .name {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .position {
          color: rgb(32, 64, 151);
          font-size: 18px;
          margin-top: 5px;
        }
        
        .contact {
          font-size: 14px;
        }
        
        .contact a {
          color: rgb(32, 64, 151);
          text-decoration: none;
        }
        
        .title {
          color: rgb(32, 64, 151);
          font-size: 24px;
          text-align: center;
          margin: 10px 0;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .divider {
          border-bottom: 1px solid rgb(32, 64, 151);
          margin: 10px 0;
        }
        
        .content {
          text-align: justify;
          margin-bottom: 15px;
        }
        
        .signature {
          margin-top: 40px;
        }
        
        .footer {
          position: fixed;
          bottom: 20px;
          right: 20px;
          font-size: 9pt;
          color: rgb(179, 179, 179);
        }
        
        p {
          margin: 0 0 12pt 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="header-left contact">
            
          </div>
          
          <div class="header-center">
            <div class="name">John Doe</div>
            <div class="position">For: ${
              jobPosition || "Position at " + companyName
            }</div>
          </div>
          
          <div class="header-right contact">
          </div>
        </div>
        
        <div class="divider"></div>
        
        <div class="title">Cover Letter</div>
        
        <div class="content">
          ${formattedCoverLetter}
        </div>
        
        <div class="signature">
          
        </div>
      </div>
      
      <div class="footer">
        Page 1 of 1, Updated ${formattedDate}
      </div>
    </body>
    </html>
    `;

    // Launch browser
    const browser = await puppeteer.launch({
      headless: "new",
    });
    const page = await browser.newPage();

    // Set content and generate PDF
    await page.setContent(htmlContent);

    // Generate PDF with A4 size
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1mm",
        right: "1mm",
        bottom: "0mm",
        left: "1mm",
      },
    });

    // Close browser
    await browser.close();

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
      { error: "An error occurred while generating the PDF" },
      { status: 500 }
    );
  }
}
