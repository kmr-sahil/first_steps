"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation'

function AuctionIdPage() {

    const pathname = usePathname()
    const router = useRouter()

    const [auctionData, setAuctionData] = useState('');
    const [bidDetails, setBidDetails] = useState({
        bidPrice: '',
        auctionId: '',
    });
    const [errors, setErrors] = useState(null); // State to hold validation errors
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Set auctionId using window.location.href.split('/').pop() on the client side
        setBidDetails((prevBidDetails) => ({
            ...prevBidDetails,
            auctionId: pathname.split('/')[2],
        }));
    }, []); // Empty dependency array ensures this effect runs only once on component mount

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                
                const id = pathname.split('/')[2]
                console.log(id);

                const res = await axios.post("/api/auctiondetails", { auctionId: id });
                setAuctionData(res.data.data);
            } catch (error) {
                setErrors(error)
                console.log("API Error:", error.message);
                setTimeout(() => {
                    setErrors(''); // Reset showErr to false after 200ms
                }, 3000);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, []);

    const onSubmit = async () => {
        setLoading(true)
        try {
            
            const res = await axios.post("/api/bid", bidDetails);
            console.log(res);
            router.refresh()
        } catch (error) {
            setErrors(error)
            console.log("Bid API Error:", error);
            setTimeout(() => {
                setErrors(''); // Reset showErr to false after 200ms
            }, 3000);
        } finally {
            setLoading(false)
        }
    };

    console.log(auctionData)

    return (
        <div className='relative w-[90%] sm:w-[80%] md:w-[40rem] lg:w-[48rem] xl:w-[58rem] mx-auto p-[1rem] sm:p-[2rem] flex items-center justify-start flex-wrap gap-[1rem]'>

            {errors && (
                <div className="z-50 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-primary p-[1rem] rounded-md transition-all error">
                    <button className="absolute right-2 top-0" onClick={()=> {setErrors(null)}}>x</button>
                    
                        <div key="api-error">{errors.message}</div>
                    
                </div>
            )}

            {loading && (
                <div className="z-50 absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-primary p-[1rem] rounded-md transition-all error">
                    <div className="custom-loader"></div>
                </div>
            )}

        <h1 className="w-[100%] text-[2rem] text-center font-medium mt-[2rem]">Place your Bid</h1>

        <div className='relative w-[85%] sm:w-[26rem] md:w-[30rem] mx-auto mt-[1rem] p-[2rem] text-text bg-secondary rounded-lg flex flex-col gap-[0.5rem]'>
            <a className='absolute btn-primary bg-secondary text-accent outline-none py-[0.25rem] px-[0.75rem] rounded-lg right-0 -top-[3.4rem]' href="/feed">x</a>
            <h1 className='text-[1.5rem] font-bold'>{auctionData.auctionDetails?.title}</h1>
            <p className='text-lg'>{auctionData.auctionDetails?.description}</p>
            <span className='text-accent font-bold text-[1.8rem] mt-[1rem]'>₹ {auctionData.auctionDetails?.price}</span>

            <input
                type="number"
                className='input-class mt-[1rem]'
                placeholder='enter the bidding amount'
                value={bidDetails.bidPrice}
                onChange={(e) => setBidDetails({ ...bidDetails, bidPrice: e.target.value })}
            />
            <button
                className='btn-primary my-[1rem]'
                onClick={onSubmit}
            >
                Place Bid
            </button>

        </div>

        <div className='w-[85%] sm:w-[26rem] md:w-[30rem] mx-auto mt-[1rem] p-[2rem] text-text bg-secondary rounded-lg flex flex-col gap-[0.5rem]'>
        {auctionData.bidders?.map((bidder) => (
                <p key={bidder._id} className='text-lg'>
                    Bidder: {bidder.username}
                </p>
        ))}
        </div>
        

        </div>
    );
}

export default AuctionIdPage;