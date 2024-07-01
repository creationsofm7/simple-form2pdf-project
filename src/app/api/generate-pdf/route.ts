import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(req: NextRequest) {
  const { name, email, countryCode, phone, address, pincode, date, time, reason, gender } = await req.json();

  // Create a new PDFDocument
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  // Load fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Set header text
  const headerText = 'Entry Pass Details';
  page.drawText(headerText, {
    x: 200,
    y: 370,
    size: 20,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Define the field names and values
  const fields = [
    { label: 'Name:', value: name },
    { label: 'Gender:', value: gender.label },
    { label: 'Email:', value: email },
    { label: 'Phone:', value: `${phone}` },
    { label: 'Address:', value: address },
    { label: 'Pincode:', value: pincode },
    { label: 'Date:', value: date },
    { label: 'Time:', value: time },
    { label: 'Reason:', value: reason },
  ];

  // Set the starting position for text
  let yPosition = 340;

  // Loop through fields to draw them
  fields.forEach(field => {
    page.drawText(field.label, {
      x: 50,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(field.value, {
      x: 150,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20; // Move down for the next line
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="form-data.pdf"',
    },
  });
}
