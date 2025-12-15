import {baseService} from "@/services/baseService";
import {IProfile} from "@/types/profile";


class profileService extends baseService {
    getProfile(): Promise<IProfile> {
        return this.get<IProfile>('/profile');
    }

    updateProfile(formData: FormData): Promise<IProfile> {
        return this.post('/profile', formData) as Promise<IProfile>;
    }
}

export default new profileService();