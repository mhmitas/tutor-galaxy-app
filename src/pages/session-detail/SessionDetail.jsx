import React from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { differenceInCalendarDays, format } from "date-fns";
import useRole from '../../hooks/useRole';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast'

const SessionDetail = () => {
    const navigate = useNavigate()
    const { user, authLoading } = useAuth()
    const [role, isLoading] = useRole()
    const axiosSecure = useAxiosSecure()
    const { id } = useParams()

    // get detail data of the session
    const { data = {}, isPending: dataLoading, refetch } = useQuery({
        queryKey: ['session-detail', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/study-sessions/${id}`)
            // console.log(data);
            return data
        }
    })

    // get detail data of the session
    const { data: usersBooedIds = {}, refetch: refetchUsersBooedIds } = useQuery({
        queryKey: ['usersBooedIds', user?.email],
        enabled: !authLoading || !!user?.email,
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/bookings/session-ids/${user?.email}`)
            // console.log(data);
            return data
        }
    })

    // destructuring from loaded detail data
    const { session_title, thumbnail_image, tutor_email, tutor_name, registrationDuration, registration_fee, classDuration, session_description } = data;

    // deal with date
    const regStartDate = data?.registrationDuration?.regStart;
    const regEndDate = data?.registrationDuration?.regEnd;
    let dateValidation;
    if (regEndDate && regStartDate && !dataLoading) {
        dateValidation = differenceInCalendarDays(
            new Date(regEndDate),
            new Date(),
        )
    }

    if (dataLoading || isLoading || authLoading) {
        return <span>Loading...</span>
    }

    async function handleBookNowButton() {
        if (usersBooedIds.includes(data._id)) {
            return toast('You have already booked this session')
        }
        // does the session is free?  
        if (Number(registration_fee) === 0) {
            const sessionData = {
                session_title, tutor_email, tutor_name, registrationDuration, classDuration,
                sessionId: data._id,
                userName: user?.displayName,
                userEmail: user?.email,
            }
            try {
                const res = await axiosSecure.post(`/bookings`, sessionData)
                console.log(res.data);
                if (res.data.insertedId) {
                    toast.success('Session Booked')
                }
                refetch()
                refetchUsersBooedIds()
            } catch (err) {
                console.error(err);
            }


            return
        }
        return alert('You cannot book it now')
        // navigate('/')
    }

    return (
        <div>
            <section className="bg-base-100 my-10">
                <div className="container mx-auto p-6 shadow-md rounded-lg">
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
                        <img src={thumbnail_image} alt="Session Thumbnail" className="w-full lg:w-1/3 rounded-lg" />
                        <div className="">
                            <h1 className="text-2xl font-bold mb-2">{session_title}</h1>
                            <div className="mb-3">
                                <p className='text-lg'><strong>Tutor:</strong> {tutor_name}</p>
                                <p className='text-sm'><strong>Email:</strong> {tutor_email}</p>
                            </div>
                            <div className="flex items-center mb-2">
                                <div className="rating">
                                    <input type="radio" name="rating" className="mask mask-star-2 bg-yellow-400" />
                                    <input type="radio" name="rating" className="mask mask-star-2 bg-yellow-400" />
                                    <input type="radio" name="rating" className="mask mask-star-2 bg-yellow-400" />
                                    <input type="radio" name="rating" className="mask mask-star-2 bg-yellow-400" />
                                    <input type="radio" name="rating" className="mask mask-star-2 bg-gray-400" />
                                </div>
                                <span className="ml-2 ">4.0</span>
                            </div>
                            <p className="mb-4">{session_description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><strong>Registration Start Date:</strong> {format(new Date(registrationDuration?.regEnd), 'dd MMM yyyy')}</p>
                                <p><strong>Registration End Date:</strong> {format(new Date(registrationDuration?.regStart), 'dd MMM yyyy')}</p>
                                <p><strong>Class Start Date:</strong> {format(new Date(classDuration?.startDate), 'dd MMM yyyy')}</p>
                                <p><strong>Class End Date:</strong> {format(new Date(classDuration?.startDate), 'dd MMM yyyy')}</p>
                                <p><strong>Session Duration:</strong> {data.session_duration || data['Session Duration']}</p>
                                <p><strong>Registration Fee:</strong> ${registration_fee}</p>
                            </div>
                            {
                                role === 'student' &&
                                <button
                                    onClick={handleBookNowButton}
                                    className="btn btn-primary mt-4"
                                    disabled={dateValidation < 0 && true}
                                >{dateValidation < 0 ?
                                    'Registration Closed' :
                                    usersBooedIds.includes(data._id) ?
                                        'Booked' :
                                        'Book Now'
                                    }
                                </button>
                            }
                        </div>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-xl font-bold">Reviews</h2>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg shadow">
                                <p className="font-semibold">Student Name 1</p>
                                <p className="">Review text from student 1...</p>
                            </div>
                            <div className="p-4 rounded-lg shadow">
                                <p className="font-semibold">Student Name 2</p>
                                <p className="">Review text from student 2...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SessionDetail;