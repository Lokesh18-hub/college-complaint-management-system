import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data safely
  await prisma.attachment.deleteMany({});
  await prisma.complaintUpdate.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.staff.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Cleaned up existing records.');

  // Password hashes
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const studentPasswordHash = await bcrypt.hash('Student@123', 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@college.edu',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      department: 'Central Administration',
      phone: '+91 90000 12345',
    },
  });
  console.log('👤 Created Admin: admin@college.edu');

  // 2. Create Students
  const studentsData = [
    {
      name: 'Aarav Sharma',
      email: 'student@college.edu',
      studentId: 'STU-2024-001',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      department: 'Computer Science',
      course: 'B.Tech CSE',
      year: '3rd Year',
      semester: '6th Sem',
      phone: '+91 98765 43210',
    },
    {
      name: 'Priya Patel',
      email: 'priya.patel@student.college.edu',
      studentId: 'STU-2024-042',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      department: 'Electrical Engineering',
      course: 'B.Tech EE',
      year: '2nd Year',
      semester: '4th Sem',
      phone: '+91 98765 43211',
    },
    {
      name: 'Rahul Verma',
      email: 'rahul.verma@student.college.edu',
      studentId: 'STU-2023-118',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      department: 'Mechanical Engineering',
      course: 'B.Tech ME',
      year: '4th Year',
      semester: '8th Sem',
      phone: '+91 98765 43212',
    },
    {
      name: 'Sneha Reddy',
      email: 'sneha.reddy@student.college.edu',
      studentId: 'STU-2025-089',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      department: 'Information Technology',
      course: 'B.Tech IT',
      year: '1st Year',
      semester: '2nd Sem',
      phone: '+91 98765 43213',
    },
    {
      name: 'Amit Kumar',
      email: 'amit.kumar@student.college.edu',
      studentId: 'STU-2024-210',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      department: 'Civil Engineering',
      course: 'B.Tech Civil',
      year: '3rd Year',
      semester: '5th Sem',
      phone: '+91 98765 43214',
    },
  ];

  const students = await Promise.all(
    studentsData.map((s) => prisma.user.create({ data: s }))
  );
  console.log(`🎓 Created ${students.length} Demo Students.`);

  // 3. Create 10 Departments
  const departmentsData = [
    { name: 'IT Services', description: 'Campus networks, lab computers, Wi-Fi connectivity, and smart classrooms.' },
    { name: 'Facility Maintenance', description: 'Building infrastructure, civil repairs, painting, and structural maintenance.' },
    { name: 'Electrical Department', description: 'Power supply, lighting, switchboards, generators, and UPS systems.' },
    { name: 'Plumbing & Sanitation', description: 'Water supply, washroom fixtures, RO purifiers, and drainage pipelines.' },
    { name: 'Hostel Administration', description: 'Hostel rooms, mess facilities, furniture, and residential complaints.' },
    { name: 'Transport & Logistics', description: 'College buses, parking arrangements, and campus shuttle services.' },
    { name: 'Housekeeping & Hygiene', description: 'Corridor cleanliness, garbage collection, and hygiene sanitation.' },
    { name: 'Library & Learning Resources', description: 'Book availability, digital reading room, quiet zone, and RFID gates.' },
    { name: 'Campus Security', description: 'Surveillance CCTV cameras, ID gates, safety escorts, and parking security.' },
    { name: 'Student Affairs & Academics', description: 'Timetables, portal issues, extracurricular amenities, and certificates.' },
  ];

  const departments = await Promise.all(
    departmentsData.map((d) => prisma.department.create({ data: d }))
  );
  console.log(`🏢 Created ${departments.length} Departments.`);

  // Map for easy access
  const deptMap = new Map(departments.map((d) => [d.name, d.id]));

  // 4. Create Staff Members
  const staffData = [
    { name: 'Vikram Mehta', email: 'vikram.it@college.edu', phone: '+91 91234 56780', departmentId: deptMap.get('IT Services')! },
    { name: 'Rajesh Sharma', email: 'rajesh.it@college.edu', phone: '+91 91234 56781', departmentId: deptMap.get('IT Services')! },
    { name: 'Sunil Jadhav', email: 'sunil.maint@college.edu', phone: '+91 91234 56782', departmentId: deptMap.get('Facility Maintenance')! },
    { name: 'Ramesh Patil', email: 'ramesh.elec@college.edu', phone: '+91 91234 56783', departmentId: deptMap.get('Electrical Department')! },
    { name: 'Santosh Yadav', email: 'santosh.plumb@college.edu', phone: '+91 91234 56784', departmentId: deptMap.get('Plumbing & Sanitation')! },
    { name: 'Mrs. Geeta Deshmukh', email: 'geeta.hostel@college.edu', phone: '+91 91234 56785', departmentId: deptMap.get('Hostel Administration')! },
    { name: 'Mahesh Kulkarni', email: 'mahesh.transport@college.edu', phone: '+91 91234 56786', departmentId: deptMap.get('Transport & Logistics')! },
    { name: 'Anita Shinde', email: 'anita.hk@college.edu', phone: '+91 91234 56787', departmentId: deptMap.get('Housekeeping & Hygiene')! },
    { name: 'Dr. Sudhir Roy', email: 'sudhir.lib@college.edu', phone: '+91 91234 56788', departmentId: deptMap.get('Library & Learning Resources')! },
    { name: 'Chief Baldev Singh', email: 'baldev.sec@college.edu', phone: '+91 91234 56789', departmentId: deptMap.get('Campus Security')! },
  ];

  const staffMembers = await Promise.all(
    staffData.map((s) => prisma.staff.create({ data: s }))
  );
  console.log(`👨‍🔧 Created ${staffMembers.length} Staff Members.`);

  const staffMap = new Map(staffMembers.map((s) => [s.name, s.id]));

  // 5. Create 15+ Comprehensive Complaints across all lifecycle stages
  const primaryStudent = students[0]; // Aarav
  const s2 = students[1]; // Priya
  const s3 = students[2]; // Rahul
  const s4 = students[3]; // Sneha
  const s5 = students[4]; // Amit

  const complaintsList = [
    // 1. SUBMITTED
    {
      complaintNumber: 'CMP-0001',
      studentId: primaryStudent.id,
      title: 'High-speed Wi-Fi router offline in Computer Lab 304',
      category: 'IT Services',
      description: 'The primary access point in Computer Lab 304 stopped broadcasting SSID. Over 40 students attending practical coding sessions cannot connect to the server or internet.',
      location: 'Academic Block B, 3rd Floor, Lab 304',
      priority: 'HIGH',
      status: 'SUBMITTED',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updates: [
        { userId: primaryStudent.id, comment: 'Complaint submitted with high priority. Lab session is scheduled today at 2 PM.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      ],
    },
    // 2. UNDER_REVIEW
    {
      complaintNumber: 'CMP-0002',
      studentId: s2.id,
      title: 'Water cooler purifier leaking on 2nd Floor corridor',
      category: 'Plumbing & Sanitation',
      description: 'The cold water dispenser near room 204 is continuously leaking water, creating a slippery surface that poses an immediate slipping hazard for students.',
      location: 'Science Block, 2nd Floor Corridor near Rm 204',
      priority: 'MEDIUM',
      status: 'UNDER_REVIEW',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      updates: [
        { userId: s2.id, comment: 'Ticket created with attached location details.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Reviewed by admin. Water supply valve inspected, verifying sanitation crew availability.', status: 'UNDER_REVIEW', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
      ],
    },
    // 3. ASSIGNED
    {
      complaintNumber: 'CMP-0003',
      studentId: primaryStudent.id,
      title: 'Ceiling projector lamp flickering intermittently in Seminar Hall 1',
      category: 'Electrical Department',
      description: 'During presentations, the ceiling mounted projector bulb turns black and flickers every 30 seconds. Makes watching slide decks very difficult during guest lectures.',
      location: 'Main Auditorium Annex, Seminar Hall 1',
      priority: 'MEDIUM',
      status: 'ASSIGNED',
      departmentId: deptMap.get('Electrical Department'),
      assignedStaffId: staffMap.get('Ramesh Patil'),
      createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
      updates: [
        { userId: primaryStudent.id, comment: 'Complaint submitted by student Aarav Sharma.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Assigned to Electrical Department and staff Ramesh Patil for bulb module replacement.', status: 'ASSIGNED', createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000) },
      ],
    },
    // 4. IN_PROGRESS (Critical)
    {
      complaintNumber: 'CMP-0004',
      studentId: s3.id,
      title: 'Power outage and sparking switchboard in Boys Hostel Block C',
      category: 'Electrical Department',
      description: 'The main distribution switchboard near Room 112 on Ground Floor produced sparks and tripped the circuit breaker. 12 rooms are currently without lighting or power.',
      location: 'Boys Hostel Block C, Ground Floor corridor',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      departmentId: deptMap.get('Electrical Department'),
      assignedStaffId: staffMap.get('Ramesh Patil'),
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      updates: [
        { userId: s3.id, comment: 'Emergency report: Sparking observed in switchboard.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Escalated to CRITICAL priority. Dispatched senior electrician.', status: 'ASSIGNED', createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Ramesh Patil isolated the breaker and is replacing the burnt contactors and MCB unit.', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
      ],
    },
    // 5. IN_PROGRESS
    {
      complaintNumber: 'CMP-0005',
      studentId: s4.id,
      title: 'Air conditioning unit blowing warm air in Digital Library Room',
      category: 'Facility Maintenance',
      description: 'The split AC in the quiet study zone is running but not cooling, resulting in a stuffy and humid room where students cannot study comfortably.',
      location: 'Central Library, 1st Floor Digital Reading Hall',
      priority: 'LOW',
      status: 'IN_PROGRESS',
      departmentId: deptMap.get('Facility Maintenance'),
      assignedStaffId: staffMap.get('Sunil Jadhav'),
      createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000),
      updates: [
        { userId: s4.id, comment: 'Complaint submitted by Sneha Reddy.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Assigned to Facility Maintenance.', status: 'ASSIGNED', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'HVAC technicians cleaning filters and checking refrigerant level.', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) },
      ],
    },
    // 6. RESOLVED (Waiting for student close)
    {
      complaintNumber: 'CMP-0006',
      studentId: primaryStudent.id,
      title: 'Broken window latch rattling loudly in Classroom 102',
      category: 'Facility Maintenance',
      description: 'The aluminum window sash has a broken lock mechanism causing constant rattling during lecture hours due to high wind.',
      location: 'Engineering Block A, Ground Floor, Room 102',
      priority: 'LOW',
      status: 'RESOLVED',
      departmentId: deptMap.get('Facility Maintenance'),
      assignedStaffId: staffMap.get('Sunil Jadhav'),
      resolutionDetails: 'Window locking arm and silicone weather seals have been completely replaced and tested. Window now seals shut quietly.',
      resolvedBy: 'System Administrator',
      resolvedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      updates: [
        { userId: primaryStudent.id, comment: 'Complaint lodged.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Assigned to maintenance carpentry team.', status: 'ASSIGNED', createdAt: new Date(Date.now() - 40 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Hardware parts procured and fitted.', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Resolution provided: Window locking arm and silicone weather seals replaced.', status: 'RESOLVED', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
      ],
    },
    // 7. CLOSED (Fully verified cycle)
    {
      complaintNumber: 'CMP-0007',
      studentId: primaryStudent.id,
      title: 'Restroom tap leaking water continuously in Girls Common Room',
      category: 'Plumbing & Sanitation',
      description: 'Washbasin faucet #2 was stripped and could not be turned off completely, leading to continuous water wastage.',
      location: 'Student Activity Center, 1st Floor Washroom',
      priority: 'HIGH',
      status: 'CLOSED',
      departmentId: deptMap.get('Plumbing & Sanitation'),
      assignedStaffId: staffMap.get('Santosh Yadav'),
      resolutionDetails: 'Ceramic disc cartridge replaced in the faucet assembly. Valve pressure adjusted and leak verified 100% resolved.',
      resolvedBy: 'System Administrator',
      resolvedAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
      closedAt: new Date(Date.now() - 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000),
      updates: [
        { userId: primaryStudent.id, comment: 'Reported water wastage in common room faucet.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 96 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Assigned to plumbing team Santosh Yadav.', status: 'ASSIGNED', createdAt: new Date(Date.now() - 90 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Plumbing technician on site replacing valve cartridge.', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 80 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Resolved: Ceramic cartridge replaced, no further leaking.', status: 'RESOLVED', createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000) },
        { userId: primaryStudent.id, comment: 'Complaint verified and closed by Aarav Sharma. Thank you for prompt action!', status: 'CLOSED', createdAt: new Date(Date.now() - 60 * 60 * 1000) },
      ],
    },
    // 8. SUBMITTED
    {
      complaintNumber: 'CMP-0008',
      studentId: s5.id,
      title: 'College Bus Route 14 arriving 30 minutes late consistently',
      category: 'Transport & Logistics',
      description: 'For the past 4 consecutive days, Bus #14 from Metro Station to Campus has arrived 30-40 minutes behind schedule, causing students to miss first period morning lectures.',
      location: 'North Campus Bus Terminal / Route 14',
      priority: 'MEDIUM',
      status: 'SUBMITTED',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updates: [
        { userId: s5.id, comment: 'Report submitted by Amit Kumar on behalf of 25 commuting students.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
      ],
    },
    // 9. UNDER_REVIEW
    {
      complaintNumber: 'CMP-0009',
      studentId: s3.id,
      title: 'Dustbins overflowing near Cafeteria outdoor seating',
      category: 'Housekeeping & Hygiene',
      description: 'Outdoor food waste bins have not been cleared since yesterday evening, causing foul odor and attracting stray birds and pests around student dining tables.',
      location: 'Central Cafeteria Courtyard, Lawn B',
      priority: 'MEDIUM',
      status: 'UNDER_REVIEW',
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      updates: [
        { userId: s3.id, comment: 'Hygiene complaint submitted.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Admin reviewing with housekeeping head Anita Shinde.', status: 'UNDER_REVIEW', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
      ],
    },
    // 10. ASSIGNED
    {
      complaintNumber: 'CMP-0010',
      studentId: s4.id,
      title: 'CCTV Camera blind spot near West Gate 2 parking lot',
      category: 'Campus Security',
      description: 'Two-wheeler parking near Gate 2 has a misaligned CCTV camera pointing upwards into the tree canopy, leaving student bikes unmonitored.',
      location: 'West Campus Gate 2, Two-Wheeler Parking Lot',
      priority: 'HIGH',
      status: 'ASSIGNED',
      departmentId: deptMap.get('Campus Security'),
      assignedStaffId: staffMap.get('Chief Baldev Singh'),
      createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
      updates: [
        { userId: s4.id, comment: 'Security hazard reported by student.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Assigned to Campus Security team to recalibrate camera angle.', status: 'ASSIGNED', createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
      ],
    },
    // 11. IN_PROGRESS
    {
      complaintNumber: 'CMP-0011',
      studentId: primaryStudent.id,
      title: 'Hostel Mess dinner food quality issue: undercooked food served',
      category: 'Hostel Administration',
      description: 'Hostel Mess Hall #2 served undercooked rice and stale curry during dinner on Friday. Multiple hostellers experienced stomach discomfort.',
      location: 'Hostel Dining Complex, Mess Hall 2',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      departmentId: deptMap.get('Hostel Administration'),
      assignedStaffId: staffMap.get('Mrs. Geeta Deshmukh'),
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
      updates: [
        { userId: primaryStudent.id, comment: 'Food hygiene grievance submitted.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Forwarded to Hostel Warden & Mess Committee.', status: 'ASSIGNED', createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Inspection conducted by Mrs. Geeta Deshmukh with catering supervisor. Warning issued to vendor.', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000) },
      ],
    },
    // 12. RESOLVED
    {
      complaintNumber: 'CMP-0012',
      studentId: s2.id,
      title: 'Barcode scanner malfunctioning at Library checkout desk',
      category: 'Library & Learning Resources',
      description: 'The laser handheld scanner at counter 2 fails to read student RFID cards and book barcodes, creating 20-minute long queues during lunch break.',
      location: 'Central Library, Ground Floor Issue Counter',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      departmentId: deptMap.get('Library & Learning Resources'),
      assignedStaffId: staffMap.get('Dr. Sudhir Roy'),
      resolutionDetails: 'Faulty optical sensor unit was replaced with a new Honeywell 2D barcode imager. All counter checkouts working at full speed.',
      resolvedBy: 'System Administrator',
      resolvedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 55 * 60 * 60 * 1000),
      updates: [
        { userId: s2.id, comment: 'Reported slow library issue desk queue.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 55 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Assigned to Dr. Sudhir Roy.', status: 'ASSIGNED', createdAt: new Date(Date.now() - 45 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Hardware diagnostics in progress.', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Resolved: Replaced with new 2D imager scanner.', status: 'RESOLVED', createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) },
      ],
    },
    // 13. CLOSED
    {
      complaintNumber: 'CMP-0013',
      studentId: s3.id,
      title: 'Student Portal showing incorrect elective subject assignment',
      category: 'Student Affairs & Academics',
      description: 'Student portal displays "Cloud Computing Elective" instead of selected "Cybersecurity & Cryptography" course for Semester 6.',
      location: 'ERP Academic Portal / Registrar Office',
      priority: 'HIGH',
      status: 'CLOSED',
      departmentId: deptMap.get('Student Affairs & Academics'),
      resolutionDetails: 'Course database enrollment record updated by Registrar. Correct course now reflected on ERP portal and LMS.',
      resolvedBy: 'System Administrator',
      resolvedAt: new Date(Date.now() - 80 * 60 * 60 * 1000),
      closedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 110 * 60 * 60 * 1000),
      updates: [
        { userId: s3.id, comment: 'Submitted academic course correction request.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 110 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Assigned to Academic Records desk.', status: 'ASSIGNED', createdAt: new Date(Date.now() - 100 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Updating elective roster in student information system.', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 90 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Elective corrected to Cybersecurity.', status: 'RESOLVED', createdAt: new Date(Date.now() - 80 * 60 * 60 * 1000) },
        { userId: s3.id, comment: 'Verified on LMS portal. Thank you!', status: 'CLOSED', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      ],
    },
    // 14. SUBMITTED
    {
      complaintNumber: 'CMP-0014',
      studentId: primaryStudent.id,
      title: 'Water drainage blocked in Chemistry Lab sink #4',
      category: 'Plumbing & Sanitation',
      description: 'Acid disposal wash sink has a severely clogged trap causing wastewater to back up during laboratory sessions.',
      location: 'Chemistry Block, 2nd Floor, Organic Lab',
      priority: 'HIGH',
      status: 'SUBMITTED',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      updates: [
        { userId: primaryStudent.id, comment: 'Lab sink clog reported.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
      ],
    },
    // 15. IN_PROGRESS
    {
      complaintNumber: 'CMP-0015',
      studentId: s5.id,
      title: 'Auditorium central PA speakers generating loud audio feedback hum',
      category: 'IT Services',
      description: 'Ground audio amplifier channel B has a grounded shielding issue creating a constant 60Hz hum over the sound system during college events.',
      location: 'Main Auditorium, Sound Control Booth',
      priority: 'LOW',
      status: 'IN_PROGRESS',
      departmentId: deptMap.get('IT Services'),
      assignedStaffId: staffMap.get('Vikram Mehta'),
      createdAt: new Date(Date.now() - 32 * 60 * 60 * 1000),
      updates: [
        { userId: s5.id, comment: 'Submitted audio defect ticket.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 32 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Assigned to Vikram Mehta for XLR cable and DI box isolation.', status: 'ASSIGNED', createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Replacing damaged ground-loop isolator transformer.', status: 'IN_PROGRESS', createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000) },
      ],
    },
    // 16. RESOLVED
    {
      complaintNumber: 'CMP-0016',
      studentId: primaryStudent.id,
      title: 'Broken desk bench in Lecture Hall 201',
      category: 'Facility Maintenance',
      description: 'Row 4 desk plank is cracked in half with sharp exposed wood splinters, making the seating unusable.',
      location: 'Main Academic Wing, 2nd Floor, Room 201',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      departmentId: deptMap.get('Facility Maintenance'),
      assignedStaffId: staffMap.get('Sunil Jadhav'),
      resolutionDetails: 'Damaged wooden benchtop was removed and replaced with a newly varnished hardwood plank. Re-anchored securely to metal frame.',
      resolvedBy: 'System Administrator',
      resolvedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 42 * 60 * 60 * 1000),
      updates: [
        { userId: primaryStudent.id, comment: 'Reported broken desk in Hall 201.', status: 'SUBMITTED', createdAt: new Date(Date.now() - 42 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Assigned to carpentry maintenance.', status: 'ASSIGNED', createdAt: new Date(Date.now() - 35 * 60 * 60 * 1000) },
        { userId: admin.id, comment: 'Benchtop replaced and safely sanded/varnished.', status: 'RESOLVED', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
      ],
    },
  ];

  for (const cData of complaintsList) {
    const { updates, ...complaintFields } = cData;
    const complaint = await prisma.complaint.create({
      data: complaintFields as any,
    });

    if (updates && updates.length > 0) {
      for (const u of updates) {
        await prisma.complaintUpdate.create({
          data: {
            complaintId: complaint.id,
            userId: u.userId,
            comment: u.comment,
            status: u.status,
            createdAt: u.createdAt,
          },
        });
      }
    }
  }

  console.log(`📋 Created ${complaintsList.length} Demo Complaints across all statuses.`);

  // 6. Create Demo Notifications for Student
  await prisma.notification.createMany({
    data: [
      {
        userId: primaryStudent.id,
        title: 'Complaint Resolved! Please Confirm',
        message: 'Complaint #CMP-0006 (Broken window latch) has been marked as RESOLVED. Please verify and close ticket.',
        type: 'SUCCESS',
        link: '/student/complaints',
        read: false,
      },
      {
        userId: primaryStudent.id,
        title: 'Status Updated: ASSIGNED',
        message: 'Your complaint #CMP-0003 has been assigned to Ramesh Patil (Electrical Department).',
        type: 'INFO',
        link: '/student/complaints',
        read: false,
      },
      {
        userId: primaryStudent.id,
        title: 'Complaint Submitted',
        message: 'Your complaint #CMP-0001 has been received and is pending review.',
        type: 'INFO',
        link: '/student/complaints',
        read: true,
      },
    ],
  });

  console.log('🔔 Created initial demo notifications.');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
