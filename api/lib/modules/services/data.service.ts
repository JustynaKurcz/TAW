import {IData, Query} from '../models/data.model';
import model from '../schemas/data.schema';

class DataService {

    public async createData(postParams: IData) {
        try {
            const data = new model(postParams);
            return await data.save();
        } catch (error) {
            throw new Error('Failed to create data');
        }
    }

    public async browseData(query: Query<number | string | boolean>) {
        try {
            return await model.find(query, {__v: 0});
        } catch (error) {
            throw new Error('Failed to browse data');
        }
    }

    public async removeAllData(query: Query<number | string | boolean>) {
        try {
            await model.deleteMany(query);
        } catch (error) {
            throw new Error('Failed to remove all data');
        }
    }

    public async removeDataById(query: Query<number | string | boolean>) {
        try {
            await model.findOneAndDelete(query);
        } catch (error) {
            throw new Error('Failed to remove data by id');
        }
    }

    public async getById(query: Query<number | string | boolean>) {
        try {
            return await model.findById(query, {__v: 0});
        } catch (error) {
            throw new Error('Query failed: ${error}');
        }
    }
}

export default DataService;
