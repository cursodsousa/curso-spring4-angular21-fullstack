package io.github.ds.planeja.dominio.dashboard;

import io.github.ds.planeja.dominio.dashboard.dto.DashboardResumo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("dashboard")
public class DashboardController {

    @Autowired
    private DashboardService service;

    @GetMapping
    public DashboardResumo obterResumoMesAtual() {
        return service.obterResumoMesAtual();
    }
}
