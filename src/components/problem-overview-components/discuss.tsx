import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { styled } from "styled-components";
import { auth, db } from "../../firebase";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-width: 1.5px;
    border-color: #7d97ad;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function Discuss() {
  const [isLoading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };
  const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = auth.currentUser
    if (!user || isLoading || comment === '' || comment.length>180) return;
    try{
      setLoading(true)
      await addDoc(collection(db, "comments"), {
        comment,
        createdAt: Date.now(), 
        userName: user.displayName || "Anonymous",
        // 유저 고유 id로 식별, 트윗 삭제 등 허용을 제한적으로
        userId: user.uid
      })
    } catch(e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Form className="discuss" onSubmit={onSubmit}>
      <TextArea
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={comment}
        placeholder="댓글 달기"
      />
      <AttachFileButton htmlFor="file">
        {file ? "사진 추가 완료 ✅" : "사진 추가"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "올리는 중..." : "확인"}
      />
    </Form>
  );
}