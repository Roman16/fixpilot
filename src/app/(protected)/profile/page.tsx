import {Heading} from "@/app/components/layout/Heading/Heading";
import {Profile} from "@/app/(protected)/profile/Profile";

export default function ProfilePage() {
    return <div className={'profile-page'}>
        <Heading title={'Профіль'}/>

        <Profile/>
    </div>;
}