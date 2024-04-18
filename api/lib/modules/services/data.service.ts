import {IData, Query} from '../models/data.model';
import model from '../schemas/data.schema';

class DataService {
    public async createData(postParams: IData) {
        try {
            const dataModel = new model(postParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(query: Query<number | string | boolean>) {
        try {
            return await model.find(query);
        } catch (error) {
            throw new Error('Query failed: ${error}');
        }
    }

    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await model.deleteMany(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async deleteSingleData(query: Query<number | string | boolean>) {
        try {
            await model.findOneAndDelete(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania pojedynczego elementu:', error);
            throw new Error('Wystąpił błąd podczas usuwania pojedynczego elementu');
        }
    }

    public async getById(query: Query<number | string | boolean>) {
        try {
            return await model.findOne(query, {__v: 0, _id: 0});
        } catch (error) {
            throw new Error('Query failed: ${error}');
        }
    }
}

export default DataService;
