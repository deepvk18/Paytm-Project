import { RecentTransactions } from "../../../components/RecentTransactions"
import { SendCard } from "../../../components/SendCard"

export default function () {
    return <div className="w-full">
        <SendCard />
        <RecentTransactions></RecentTransactions>
    </div>
}