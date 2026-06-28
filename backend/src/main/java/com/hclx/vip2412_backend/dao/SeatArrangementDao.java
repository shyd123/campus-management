package com.hclx.vip2412_backend.dao;

import com.hclx.vip2412_backend.entity.SeatArrangement;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SeatArrangementDao {
    List<SeatArrangement> selectByCourseId(Integer courseId);
    List<SeatArrangement> selectByClassId(Integer classId);
    int batchInsert(List<SeatArrangement> arrangements);
    int deleteByCourseId(Integer courseId);
    int update(SeatArrangement arrangement);
}
