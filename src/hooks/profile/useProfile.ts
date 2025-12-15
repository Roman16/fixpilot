import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import profileService from '@/services/profileService';
import {IProfile} from "@/types/profile";
import toast from "react-hot-toast";

export const useProfile = () => {
    return useQuery<IProfile>({
        queryKey: ['profile'],
        queryFn: () => profileService.getProfile(),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => profileService.updateProfile(formData),
        onSuccess: (updatedProfile: IProfile) => {
            toast.success('Дані успішно оновлені!!')
            queryClient.setQueryData(['profile'], updatedProfile);
        },
    });
};