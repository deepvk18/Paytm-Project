
import { Card } from "@repo/ui/card"
import { getServerSession } from "next-auth"
import { authOptions } from "../app/lib/auth";
import prisma from "@repo/db/client";


async function getSentTransactions(from:number){

    const p2pSentList = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(from)
        }

    })

    return p2pSentList;

}

async function getReceivedTransactions(to:number) {

    const p2pReceivedList = await prisma.p2pTransfer.findMany({
        where: {
            toUserId: Number(to)
        }

    })

    return p2pReceivedList;

}


export async function RecentTransactions() {

    const session = await getServerSession(authOptions);
    console.log(session);

    if (!session?.user?.id) {
        return <div className="text-center text-red-500">Error: Not authenticated</div>;
    }
    const p2pSentList = await getSentTransactions(Number(session?.user?.id));
    console.log("SentList", p2pSentList);
    const p2pReceivedList = await getReceivedTransactions(Number(session?.user?.id));
    console.log("ReceivedList", p2pReceivedList);
    
    
    

    // Check if p2pList is an array before mapping
    if (!Array.isArray(p2pSentList) && !Array.isArray(p2pReceivedList) ) {
        throw new Error(`Error fetching transactions`);
    }


    if (!p2pSentList.length && !p2pReceivedList.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }

   


    return (<div>

        <Card title="Sent Transactions">
            <div className="pt-2">
                {p2pSentList.map(t => <div className="flex justify-between">
                    <div>
                        <div className="text-sm">
                            Sent INR
                        </div>
                        <div className="text-slate-600 text-xs">
                            {t.timestamp.toDateString()}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        - Rs {t.amount / 100}
                    </div>

                </div>)}
            </div>
        </Card>

        <Card title="Received Transactions">
            <div className="pt-2">
                {p2pReceivedList.map(t => <div className="flex justify-between">
                    <div>
                        <div className="text-sm">
                            Received INR
                        </div>
                        <div className="text-slate-600 text-xs">
                            {t.timestamp.toDateString()}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        + Rs {t.amount / 100}
                    </div>

                </div>)}
            </div>
        </Card>


    </div>)






}