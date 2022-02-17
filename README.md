# Quzoo Backend

## Project Description

Quzoo is a node.js express server-side quiz application. It communicates between the server and the client via REST API's.

## Routes

### Users Resource

| URL                               | HTTP verb | Result                                                                    |
| --------------------------------- | --------- | ------------------------------------------------------------------------- |
| /api/v1/user/signup               | POST      | create a new user                                                         |
| /api/v1/user/login                | POST      | return a new JSON web token that can be used to identify the current user |
| /api/v1/user/postAns              | POST      | post answers of quiz                                                      |
| /api/v1/user/info/papers/:setcode | GET       | give info of specific quiz                                                |

### Quiz Resource

| URL                                      | HTTP verb | Result                 |
| ---------------------------------------- | --------- | ---------------------- |
| /api/v1/questions/post/questionpaper     | POST      | create a new quiz      |
| /api/v1/questions/questionpaper/:setcode | GET       | return a specific quiz |
| /api/v1/questions/paperMetadata          | GET       | return all quizzes     |

## Routes Examples

1.  ### `/api/v1/user/signup` || Create new user || POST

    **Request Body**

    ```json
    {
        "username": "testDas",
        "email": "testDas@gmail.com",
        "password": "password123",
        "passwordConformation": "password123"
    }
    ```

    **Response Body**

    ```json
    {
        "status": "success",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZTAwOGEyYTMwMDkzMzVlOGMzNTZiMyIsImlhdCI6MTY0Mzg3NDA2NiwiZXhwIjoxNjUxNjUwMDY2fQ.jWGRv0_9fsKzPn_dCaKW9lmahl48CA9NcIgkfYEwchg"
    }
    ```

2.  ### `/api/v1/user/login ` || Return a new JSON web token that can be used to identify the current user || POST

    **Request Body**

    ```json
    {
        "email": "test@gmail.com",
        "password": "password123"
    }
    ```

    **Response Body**

    ```json
    {
        "status": "success",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxZTAwOGEyYTMwMDkzMzVlOGMzNTZiMyIsImlhdCI6MTY0Mzg3NDA2NiwiZXhwIjoxNjUxNjUwMDY2fQ.jWGRv0_9fsKzPn_dCaKW9lmahl48CA9NcIgkfYEwchg"
    }
    ```

3.  ### `/api/v1/user/postAns` || Post answers of quiz || POST

    **Request Body**

    ```json
    {
        "userID": "iyuvewedyuifewpohd",
        "paperInfo": {
            "setcode": 20181,
            "set_id": "61ded226e83b6f330c49ad76",
            "set_title": "practice set 1",
            "type": "JEE-mains",
            "attemptedOn": "2021-10-01T15:04:09.433Z",
            "full_duration": 3
        },
        "map": [
            {
                "Qid": "f780a065-03b5-4449-8b9d-0f5413dd4b84",
                "sub": "P",
                "ans": "087c6140-d2fc-45b4-83cd-36c1e9655ad0"
            },
            {
                "Qid": "65e0e1b4-bc80-4feb-a5ff-2c9b4376a782",
                "sub": "P",
                "ans": "3178a2fe-f057-41d3-9bda-bf236b706091"
            }
        ]
    }
    ```

    **Response Body**

    ```json
    {
        "status": "success"
    }
    ```

4.  ### `/api/v1/user/info/papers/:setcode` || Give info of specific quiz || GET

    **Response Body**

    ```json
    {
        "status": "success",
        "data": {
            "date": "2022-01-13T12:10:20.216Z",
            "document": [
                {
                    "paperInfo": {
                        "setcode": "20191",
                        "set_id": "61ded226e83b6f330c49ad76",
                        "set_title": "practice set 1",
                        "type": "JEE-mains",
                        "full_duration": 3,
                        "attemptedOn": "Thu Jan 13 2022 19:50:51 GMT+0530 (India Standard Time)"
                    },
                    "QuizData": {
                        "total_phyQ": 8,
                        "total_cheQ": 8,
                        "total_mathsQ": 8,
                        "phyQ_correct": 6,
                        "cheQ_correct": 4,
                        "mathsQ_correct": 8
                    },
                    "doc": [
                        {
                            "Qid": "f780a065-03b5-4449-8b9d-0f5413dd4b84",
                            "sub": "P",
                            "ans": "087c6140-d2fc-45b4-83cd-36c1e9655ad0",
                            "correct__ans": true
                        },
                        {
                            "Qid": "65e0e1b4-bc80-4feb-a5ff-2c9b4376a782",
                            "sub": "C",
                            "ans": "3178a2fe-f057-41d3-9bda-bf236b706091",
                            "correct__ans": true
                        },
                        {
                            "Qid": "5bf09f6d-e868-44b8-8442-2e984758096d",
                            "sub": "M",
                            "ans": "4dae04de-a63b-4739-9334-47f1bed0b3fe",
                            "correct__ans": true
                        }
                    ]
                }
            ],
            "_id": "61e03545bdedac5be8dd14e8",
            "user": "61e034d9bdedac5be8dd14d4",
            "__v": 0
        }
    }
    ```

5.  ### `/api/v1/questions/post/questionpaper` || Create a new quiz || POST

    **Request Body**

    ```json
    {
        "SetTitle": "practice set 6",
        "SetQuestionNumber": 15,
        "SetDuration": "3 hours",
        "SetYear": 20172,
        "SetDescription": "JEE-mains",
        "SetBackgroundImg": "card_bg6.jpg",
        "SetCode": 20172,
        "Questions": {
            "CQuestions": [
                {
                    "question": "C1",
                    "year": 20172,
                    "category": "JEE-mains-maths",
                    "multi-correct": false,
                    "subCod": "C",
                    "question_type": "MCQ",

                    "options": [
                        {
                            "option": "random string true",
                            "option__correct": true
                        },
                        {
                            "option": "random string",
                            "option__correct": false
                        },
                        {
                            "option": "random string",
                            "option__correct": false
                        },
                        {
                            "option": "random string",
                            "option__correct": false
                        }
                    ]
                }
            ],

            "MQuestions": [
                {
                    "question": "M1",
                    "year": 20172,
                    "category": "JEE-mains-maths",
                    "multi-correct": false,
                    "subCod": "M",
                    "question_type": "MCQ",

                    "options": [
                        {
                            "option": "random string true",
                            "option__correct": true
                        },
                        {
                            "option": "random string",
                            "option__correct": false
                        },
                        {
                            "option": "random string",
                            "option__correct": false
                        },
                        {
                            "option": "random string",
                            "option__correct": false
                        }
                    ]
                }
            ],

            "PQuestions": [
                {
                    "question": "P1",
                    "year": 20172,
                    "category": "JEE-mains-Phy",
                    "multi-correct": false,
                    "subCod": "P",
                    "question_type": "MCQ",

                    "options": [
                        {
                            "option": "random string true",
                            "option__correct": true
                        },
                        {
                            "option": "random string",
                            "option__correct": false
                        },
                        {
                            "option": "random string",
                            "option__correct": false
                        },
                        {
                            "option": "random string",
                            "option__correct": false
                        }
                    ]
                }
            ]
        }
    }
    ```

    **Response Body**

    ```json
    {
        "status": "success"
    }
    ```

6.  ### `/api/v1/questions/questionpaper/:setcode ` || Return a specific quiz || GET

    **Response Body**

    ```json
    {
        "status": "success",
        "data": {
            "_id": "61df3a8389058223c49df2c8",
            "SetCode": 20181,
            "Metadata": {
                "_id": "61df3a8389058223c49df2c6",
                "SetTitle": "practice set 1",
                "SetQuestionNumber": 15,
                "SetDuration": "3 hours",
                "SetYear": 20181,
                "SetDescription": "Easy",
                "SetBackgroundImg": "card_bg1.jpg",
                "__v": 0
            },
            "Questions": {
                "CQuestions": [
                    {
                        "question": "C3",
                        "year": 20181,
                        "category": "JEE-mains-maths",
                        "multi-correct": false,
                        "subCod": "C",
                        "question_type": "MCQ",
                        "correct__ans": {
                            "option": "random string true",
                            "option__correct": true,
                            "option_id": "a21f4735-c9e6-4bee-b558-57d7cc7e611c"
                        },
                        "options": [
                            {
                                "option": "random string true",
                                "option__correct": true,
                                "option_id": "a21f4735-c9e6-4bee-b558-57d7cc7e611c"
                            },
                            {
                                "option": "random string",
                                "option__correct": false,
                                "option_id": "44a3a46a-3b2c-4fd1-aa88-10d1a3c84a51"
                            },
                            {
                                "option": "random string",
                                "option__correct": false,
                                "option_id": "0521af90-be91-4759-83f8-87133ab75f28"
                            },
                            {
                                "option": "random string",
                                "option__correct": false,
                                "option_id": "e1179ff1-5795-4494-8ff5-54f7257771e5"
                            }
                        ],
                        "qutions_id": "3171b43b-71ae-4533-ac39-a3d3a1a2e6da"
                    }
                ],
                "MQuestions": [
                    {
                        "question": "M3",
                        "year": 20181,
                        "category": "JEE-mains-maths",
                        "multi-correct": false,
                        "subCod": "M",
                        "question_type": "MCQ",
                        "correct__ans": {
                            "option": "random string true",
                            "option__correct": true,
                            "option_id": "d44e2f9a-2677-4941-ac9a-7d49290a82ad"
                        },
                        "options": [
                            {
                                "option": "random string true",
                                "option__correct": true,
                                "option_id": "d44e2f9a-2677-4941-ac9a-7d49290a82ad"
                            },
                            {
                                "option": "random string",
                                "option__correct": false,
                                "option_id": "d859805c-f06b-4fa5-a40a-65dd510636c8"
                            },
                            {
                                "option": "random string",
                                "option__correct": false,
                                "option_id": "a9a35113-87af-46e2-a85f-37c6ff8a4425"
                            },
                            {
                                "option": "random string",
                                "option__correct": false,
                                "option_id": "5306d7c7-ac86-49c1-90c8-5c86861e2bb7"
                            }
                        ],
                        "qutions_id": "ce29aa2d-b51d-43e1-98c3-a177115db8d3"
                    }
                ],
                "PQuestions": [
                    {
                        "question": "P3",
                        "year": 20181,
                        "category": "JEE-mains-Phy",
                        "multi-correct": false,
                        "subCod": "P",
                        "question_type": "MCQ",
                        "correct__ans": {
                            "option": "random string true",
                            "option__correct": true,
                            "option_id": "84f3f8e0-fa95-4fd7-916d-fb22b452f572"
                        },
                        "options": [
                            {
                                "option": "random string true",
                                "option__correct": true,
                                "option_id": "84f3f8e0-fa95-4fd7-916d-fb22b452f572"
                            },
                            {
                                "option": "random string",
                                "option__correct": false,
                                "option_id": "01df605f-055c-4515-aa76-5e8ac3e42dab"
                            },
                            {
                                "option": "random string",
                                "option__correct": false,
                                "option_id": "68095e10-f492-4df5-84c8-7fcf5bb9d233"
                            },
                            {
                                "option": "random string",
                                "option__correct": false,
                                "option_id": "424eeec8-3645-4ee7-aaaf-a3a222b56d14"
                            }
                        ],
                        "qutions_id": "5d7013dd-5591-49ac-87f8-072b1fafcf6c"
                    }
                ]
            },
            "__v": 0,
            "id": "61df3a8389058223c49df2c8"
        }
    }
    ```

7.  ### `/api/v1/questions/paperMetadata ` || Return all quizzes || GET

    **Response Body**

    ```json
    {
        "status": "success",
        "data": [
            {
                "_id": "61df3a8389058223c49df2c6",
                "SetTitle": "practice set 1",
                "SetQuestionNumber": 15,
                "SetDuration": "3 hours",
                "SetYear": 20181,
                "SetDescription": "Easy",
                "SetBackgroundImg": "card_bg1.jpg",
                "__v": 0
            },
            {
                "_id": "61df56023b6b11080c8d0870",
                "SetTitle": "practice set 2",
                "SetQuestionNumber": 15,
                "SetDuration": "3 hours",
                "SetYear": 20191,
                "SetDescription": "JEE-mains Physics",
                "SetBackgroundImg": "card_bg2.jpg",
                "__v": 0
            }
        ]
    }
    ```
