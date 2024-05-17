import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { addDoc, updateDoc, collection, doc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

export const POST = async (req: Request) => {
    try {
        const { userId } = auth()
        const body = await req.json()

        if (!userId) {
            return new NextResponse("Un-Authorized", { status: 400 })
        }

        const { name } = body

        if (!name) {
            return new NextResponse("Store Name is missing!", { status: 400 })
        }
        const storeData = {
            name,
            userId,
            createdAt: serverTimestamp(),
        }
        // add the data to the firestore and retrive ist reference id
        const storeRef = await addDoc(collection(db, "stores"), storeData)

        // get the reference id
        const id = storeRef.id

        await updateDoc(doc(db, "stores", id), {
            ...storeData,
            id,
            updatedAt: serverTimestamp()
        })
        return NextResponse.json({ id, ...storeData })

    } catch (error) {
        console.log(`STORES_POST:${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}