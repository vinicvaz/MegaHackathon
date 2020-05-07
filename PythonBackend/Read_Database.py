import numpy as np
import sqlite3 as sqlite3




class Read_Database:

    def __init__(self):
        self.db_path  = "../Backend/src/database/db.sqlite3"
        self.conn = self.create_connection(self.db_path)


    def create_connection(self,db_file):
        conn = None
        try:
            conn = sqlite3.connect(db_file)
        except ValueError as e:
            print(e)

        return conn

    def select_new_questions(self):
        
        cur = self.conn.cursor()
        sql_select_query = """select * from questions where status = ?"""
        cur.execute(sql_select_query, ("new",))
        
        rows = cur.fetchall()

        cur.close()

        return rows

    def update_processed_questions(self, data, db):
        print('inserir dados')
        print(data)
        status = data['status']
        is_good = data['is_good']
        answer = data['answer']
        question_id = data['question_id']

        query_daya = (status, question_id)
        query = """Update questions set status = ? where id = ?"""

        cur = db.conn.cursor()

        cur.execute(query, query_daya)
        db.conn.commit()
        
        cur.close()

    def verify_processed_questions(self, data, db):
        

        if data['is_good']==1:
                return self.update_processed_questions(data, db)
        else:
            print('Criar resposta')
            print(data)
    



        



