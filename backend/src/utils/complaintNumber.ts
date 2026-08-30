import prisma from '../prisma/client';

export async function generateComplaintNumber(): Promise<string> {
  const count = await prisma.complaint.count();
  const nextNum = count + 1;
  const padded = String(nextNum).padStart(4, '0');
  let candidate = `CMP-${padded}`;
  
  // Double check uniqueness in case of race condition or gaps
  let existing = await prisma.complaint.findUnique({
    where: { complaintNumber: candidate },
  });
  
  let counter = nextNum;
  while (existing) {
    counter++;
    candidate = `CMP-${String(counter).padStart(4, '0')}`;
    existing = await prisma.complaint.findUnique({
      where: { complaintNumber: candidate },
    });
  }
  
  return candidate;
}
