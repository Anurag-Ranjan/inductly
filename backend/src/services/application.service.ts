import { prisma } from '../utils/prisma';

const getMyApplicationsService = async ({ userId }: { userId: number }) => {
    const applications = await prisma.application.findMany({
        where: {
            user_id: userId
        },
        orderBy: {
            created_at: 'desc'
        },
        select: {
            id: true,
            status: true,
            created_at: true,
            currentStage: {
                select: {
                    id: true,
                    name: true
                }
            },
            induction: {
                select: {
                    id: true,
                    title: true,
                    stages: {
                        orderBy: {
                            order_index: 'asc'
                        },
                        select: {
                            id: true
                        }
                    },
                    club: {
                        select: {
                            id: true,
                            name: true,
                            logo: true
                        }
                    }
                }
            }
        }
    });

    const formattedApplications = applications.map((application) => {
        return {
            id: application.id,
            status: application.status,
            applied_on: application.created_at,
            current_stage_id: application.currentStage?.id,
            current_stage_name: application.currentStage?.name,
            induction_id: application.induction.id,
            induction_title: application.induction.title,
            club_id: application.induction.club.id,
            club_logo: application.induction.club.logo,
            club_name: application.induction.club.name,
            stage_number: application.currentStage
                ? application.induction.stages.findIndex(
                      (s) => s.id === application.currentStage!.id
                  )
                : 0,
            totalStages: application.induction.stages.length
        };
    });

    return formattedApplications;
};

export { getMyApplicationsService };
