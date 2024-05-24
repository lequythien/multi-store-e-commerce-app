import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { addDoc, updateDoc, collection, doc, serverTimestamp, getDoc, deleteDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Store } from "@/types-db"

export const PATCH = async (req: Request,
    { params }: { params: { storeId: string } }
) => {
    try {
        const { userId } = auth()
        const body = await req.json()

        if (!userId) {
            return new NextResponse("Un-Authorized", { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is Required", { status: 400 })
        }

        const { name } = body

        if (!name) {
            return new NextResponse("Store Name is missing!", { status: 400 })
        }

        const docRef = doc(db, "stores", params.storeId);
        await updateDoc(docRef, {name});
        const store = (await getDoc(docRef)).data() as Store

        return NextResponse.json(store)

    } catch (error) {
        console.log(`STORES_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const DELETE = async (req: Request,
    { params }: { params: { storeId: string } }
) => {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse("Un-Authorized", { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is Required", { status: 400 })
        }


        const docRef = doc(db, "stores", params.storeId);

        // TODO : Delete all the subcollections- and along with those data file urls

        await deleteDoc(docRef);

        return NextResponse.json({msg: "Store and all of its sub-collections deleted", });

    } catch (error) {
        console.log(`STORES_PATCH:${error}`)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}