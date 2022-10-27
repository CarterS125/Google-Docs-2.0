import { useEffect, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import dynamic from "next/dynamic";

import { EditorState } from "draft-js";
import { convertFromRaw, convertToRaw } from "draft-js";

import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { db } from "../firebase";

import Draft from "draft-js";
import { useRouter } from "next/dist/client/router";
import { useSession } from "next-auth/client";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((module) => module.Editor),
  {
    ssr: false,
  }
);

function TextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const router = useRouter();
  const [session] = useSession();
  const { id } = router.query;

  const [snapshot] = useDocumentOnce(
    db.collection("userDocs").doc(session.user.email).collection("docs").doc(id)
  );

  useEffect(() => {
    if (snapshot?.data()?.editorState) {
      setEditorState(
        Draft.EditorState.createWithContent(
          convertFromRaw(snapshot?.data()?.editorState)
        )
      );
    }
  }, [snapshot]);

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);

    db.collection("userDocs")
      .doc(session.user.email)
      .collection("docs")
      .doc(id)
      .set(
        {
          editorState: convertToRaw(editorState.getCurrentContent()),
        },
        { merge: true }
      );
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-16">
      <Editor
        editorState={editorState}
        toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
        editorClassName="mt-6 xl:mt-6 p-10 max-w-6xl mx-auto shadow-lg mb-12 border bg-white"
        onEditorStateChange={onEditorStateChange}
      />
    </div>
  );
}

export default TextEditor;
