import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { prisma } from './prisma';

try {
    prisma.user
        .deleteMany({})
        .then(() => console.log('All records from user deleted'));

    prisma.verificationToken
        .deleteMany({})
        .then(() => console.log('All verification tokens deleted'));
} catch (error: any) {
    console.error(error);
}
