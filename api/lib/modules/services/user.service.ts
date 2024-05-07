import UserModel from '../schemas/user.schema';
import {IUser} from "../models/user.model";
import {Query} from "../models/data.model";

class UserService {
    public async createNewOrUpdate(user: IUser) {
        console.log(user)
        try {
            if (!user._id) {
                const dataModel = new UserModel(user);
                return await dataModel.save();
            } else {
                return await UserModel.findByIdAndUpdate(user._id, {$set: user}, {new: true});
            }
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async getByEmailOrName(name: string) {
        try {
            const result = await UserModel.findOne({$or: [{email: name}, {name: name}]});
            if (result) {
                return result;
            }
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
            throw new Error('Wystąpił błąd podczas pobierania danych');
        }
    }

    public async removeUserById(query: Query<number | string | boolean>) {
        try {
            await UserModel.findOneAndDelete(query);
        } catch (error) {
            throw new Error('Failed to remove data by id');
        }
    }

    public async browseUsers(query: Query<number | string | boolean>) {
        try {
            return await UserModel.find(query, {__v: 0});
        } catch (error) {
            throw new Error('Failed to browse data');
        }
    }
}

export default UserService;
