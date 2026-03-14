import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import serviceTemplatesService from '@/services/serviceTemplatesService';
import {IServiceTemplate} from '@/types/serviceTemplate';

export const useServiceTemplates = () => {
    return useQuery<IServiceTemplate>({
        queryKey: ['serviceTemplates'],
        queryFn: () => serviceTemplatesService.getTemplates(),
    });
};

export const useUpdateServiceTemplates = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IServiceTemplate) => serviceTemplatesService.updateTemplates(data),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['serviceTemplates']}),
    });
};