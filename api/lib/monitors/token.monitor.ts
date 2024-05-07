import TokenModel from '../modules/schemas/token.schema';

export const removeExpiredTokens = async () => {
    try {
        const currentDate = Date.now();
        const counter = await TokenModel.deleteMany({ expirationDate: { $lt: currentDate } });
        console.log('Expired tokens removed:', counter.deletedCount);
    } catch (error) {
        console.error('Error removing expired tokens', error);
        throw new Error('Error removing expired tokens');
    }
};

setInterval(async () => {
    await removeExpiredTokens();
    try {
        await removeExpiredTokens();
    } catch (error) {
        console.error('Error running removeExpiredTokens:', error);
    }
}, 3 * 60 * 60 * 1000);
