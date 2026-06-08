import { MemberRole } from '@prisma/client';
import { prisma } from '../utils/prisma';

async function main() {
    const userId = 31;

    // Create 5 clubs
    const clubs = await Promise.all([
        prisma.club.create({
            data: {
                name: 'Coding Club',
                description: 'Competitive programming and development club'
            }
        }),
        prisma.club.create({
            data: {
                name: 'Robotics Club',
                description: 'Robotics and embedded systems'
            }
        }),
        prisma.club.create({
            data: {
                name: 'Photography Club',
                description: 'Photography and videography enthusiasts'
            }
        }),
        prisma.club.create({
            data: {
                name: 'Literary Club',
                description: 'Debates, writing and public speaking'
            }
        }),
        prisma.club.create({
            data: {
                name: 'Cultural Club',
                description: 'Dance, music and cultural events'
            }
        })
    ]);

    // Create memberships for user 31
    await prisma.membership.createMany({
        data: [
            {
                user_id: userId,
                club_id: clubs[0].id,
                role: MemberRole.ADMIN,
                inducted_on: new Date('2025-01-10')
            },
            {
                user_id: userId,
                club_id: clubs[1].id,
                role: MemberRole.COORDINATOR,
                inducted_on: new Date('2025-01-15')
            },
            {
                user_id: userId,
                club_id: clubs[2].id,
                role: MemberRole.PRESIDENT,
                inducted_on: new Date('2025-01-20')
            },
            {
                user_id: userId,
                club_id: clubs[3].id,
                role: MemberRole.VICE_PRESIDENT,
                inducted_on: new Date('2025-01-25')
            },
            {
                user_id: userId,
                club_id: clubs[4].id,
                role: MemberRole.MEMBER,
                inducted_on: new Date('2025-02-01')
            }
        ]
    });

    console.log('✅ 5 clubs and memberships created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
