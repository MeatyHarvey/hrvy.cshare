import Activity from './../models/activity';
import { PaginatedResult } from './../models/pagination';
import { User, UserFormValues } from './../models/User';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../layout/base/history';
import { store } from '../stores/store';
import Profile from '../models/profile';
import Photo from '../models/photo';
import UserActivity from '../models/userActivity';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(config => {
    /**
     * Adding the token to the request headers.
     * */
    const token = store.commonStore.token;
    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
});

axios.interceptors.response.use(async response => {
    if (process.env.NODE_ENV === 'development')
        await sleep(1000);

    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
}, (error: AxiosError) => {
    const { config, data, headers, status } = error.response!;
    switch (status) {
        case 400:
            if (typeof data === "string") {
                toast.error(data);
            }

            if (config.method === "get" && data.errors.hasOwnProperty("id")) {
                history.push("/not-found");
            }

            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key]);
                    }
                }
                throw modalStateErrors.flat();
            }
            break;
        case 401:
            console.log('401');
            console.log(headers['www-authenticate']);
            if (status === 401 && headers['www-authenticate'].startsWith('Bearer error="invalid_token"')) {
                store.userStore.logout();
                toast.error("Session expired - please login again.");
            }
            break;
        case 404:
            history.push("/not-found");
            break;
        case 500:
            store.commonStore.setServerError(data);
            history.push("/server-error");
            break;
        default:
            break;
    }

    return Promise.reject(error);
});

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),        
    delete: <T> (url: string) => axios.delete<T>(url).then(responseBody)
};

const Activities = {
    list: (params: URLSearchParams) => axios
        .get<PaginatedResult<Activity[]>>('/activities', { params })
        .then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post<void>('/activities', activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
    current: () => requests.get<User>('/account'),
    fbLogin: (accessToken: string) => requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`, {}),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    logout: () => requests.get<void>('/account/logout'),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    refreshToken: () => requests.post<User>('/account/refreshToken', {})
}

const Profiles = {
    deletePhoto: (id: string) => requests.delete<void>(`/photos/${id}`),
    editProfile: (profile: Partial<Profile>) => requests.put<void>(`/profiles`, profile),
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    listFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listUserActivities: (username: string, predicate: string) => requests.get<UserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`),
    setMainPhoto: (id: string) => requests.post<void>(`/photos/${id}/setmain`, {}),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-type': 'multipart/form-data' }
        });
    },
    updateFollowing: (username: string) => requests.post<void>(`/follow/${username}`, {})
}

const agent = {
    Account,
    Activities,
    Profiles
}

export default agent;